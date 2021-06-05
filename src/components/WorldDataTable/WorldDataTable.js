/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-debugger */
import React, { Component, createRef } from 'react';
import axios from 'axios';
import styles from './WorldDataTable.module.css';
import defaultCountries from '../../mockedData';
class WorldDataTable extends Component {
  state = {
    worldCountryList: [],
    defaultCountriesList: defaultCountries,
    selectedRow: '',
    autocompleteList: [],
    autocompleteValue: '',
    givenForYourGoalPercentage: 0.5,
    yourGoalName: '',
  };

  startOfTable = createRef();

  componentDidMount() {
    const getWorldCountriesData = async () => {
      try {
        const res = await axios.get('https://restcountries.eu/rest/v2/all');
        this.setState({ worldCountryList: res.data });
      } catch (e) {
        console.log(
          `Error during fetching World Countries Data with error: ${e}`
        );
      }
    };
    getWorldCountriesData();
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

  transformPercentNums = (value, category) => {
    let upd = value
      .replace(' ', '')
      .replace(',', '.')
      .replace(/[^0-9.]/gim, '')
      .replace(/\.[.]/gim, '.')
      .replace();
    if (/^\.[1-9]{1,2}/gim.test(upd)) {
      upd = '0'.concat('', value);
    }
    if (/^0[0-9]/gim.test(upd) && category === 'givenForYourGoalPercentage') {
      upd.split('');
      upd = '0'.concat('.', upd[1]);
      upd = parseFloat(upd, 10).toFixed(1);
    }
    if (/^0[0-9]/gim.test(upd) && category !== 'givenForYourGoalPercentage') {
      // upd.split('');
      upd.slice(1, 2);
      upd = parseFloat(upd, 10).toFixed(1);
    }

    if (/^\.[0]{1,2}/gim.test(upd) || /^0\.0/gim.test(upd)) {
      upd = 0;
    }
    if (upd.length > 3) {
      upd.slice(0, 2);
      upd = parseFloat(upd, 10).toFixed(1);
    }
    return upd;
  };

  InputChangeHandler = (event, index, targetedTd) => {
    const { defaultCountriesList } = this.state;
    const updatedCountriesList = defaultCountriesList;

    targetedTd !== 'averageNetIncome'
      ? (updatedCountriesList[index][targetedTd] =
          this.transformPercentNums(event.target.value) / 100)
      : (updatedCountriesList[index][targetedTd] = event.target.value);
    this.setState({ defaultCountriesList: updatedCountriesList });
  };

  givenForYourGoalChangeHandler = (event) => {
    const updatedValue = event.target.value;
    const validatedUpdVal = this.transformPercentNums(
      updatedValue,
      'givenForYourGoalPercentage'
    );
    this.setState({ givenForYourGoalPercentage: validatedUpdVal });
  };

  yourGoalNameChangeHandler = (event) => {
    const updatedValue = event.target.value;
    this.setState({ yourGoalName: updatedValue });
  };

  onBlurTransformPercentNums = (value) => {
    if (value < 0.1 || value === '' || /^[0]\.$|^\.$/gim.test(value)) {
      debugger;
      this.setState({ givenForYourGoalPercentage: 0.1 });
    }
    if (value >= 100) {
      this.setState({ givenForYourGoalPercentage: 1 });
    }
    if (/^[1-9]\.$/gim.test(value)) {
      debugger;
      const upd = value.replace('.', '');
      debugger;
      this.setState({ givenForYourGoalPercentage: upd });
    }
    return false;
  };

  editRowToggle = (id) => {
    const { selectedRow } = this.state;
    this.setState((prevState) => ({
      selectedRow: prevState.selectedRow === '' ? id : '',
    }));

    if (selectedRow === '') {
      this.startOfTable.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  deleteRow = (countryName) => {
    const { defaultCountriesList } = this.state;
    const updatedCountriesList = defaultCountriesList.filter(
      (row) => row.name !== countryName
    );
    console.log(`delete row with country name: ${countryName}`);
    this.setState((prevState) => ({
      defaultCountriesList: updatedCountriesList,
    }));
  };

  selectedCountryExists = (countryName) => {
    const { defaultCountriesList, worldCountryList } = this.state;
    const index = worldCountryList.findIndex(
      (country) => countryName === country.name
    );
    console.log('index', index);
    if (defaultCountriesList.length > 0 && index > -1) {
      defaultCountriesList.filter((country) => country.name === countryName)
        .length > 0
        ? console.log(`${countryName} is already in the list!`)
        : this.addRow(countryName);
    }
  };

  addRow = (countryName) => {
    const { defaultCountriesList, worldCountryList } = this.state;
    const updatedCountriesList = defaultCountriesList;
    const newRowName = worldCountryList.filter(
      (country) => country.name === countryName
    );
    console.log('newRowName', newRowName);
    updatedCountriesList.push({
      name: countryName,
      averageNetIncome: 0,
      ageGroup20To64: 0.505,
      proYourGoalPopPercentage: 0.4,
      techSavvyPopPercentage: 0.25,
      willingToPay: 0.05,
    });
    this.setState({
      defaultCountriesList: updatedCountriesList,
      autocompleteValue: '',
    });
    this.startOfTable.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
    this.editRowToggle(countryName);
  };

  autocomplete = (event) => {
    const { worldCountryList, autocompleteList } = this.state;
    const { value } = event.target;
    const matchedCountries =
      value &&
      value !== '' &&
      worldCountryList
        .filter(
          (country) =>
            country.name.substr(0, value.length).toLowerCase() ===
            value.toLowerCase()
        )
        .map((country) => {
          const boldNamePart = (
            <strong>{country.name.substr(0, value.length)}</strong>
          );
          const restOfName = country.name.substr(value.length);

          return { boldNamePart, restOfName, name: country.name };
        });
    this.setState({
      autocompleteList: matchedCountries,
      autocompleteValue: value,
    });
    console.log(
      '%cmatchedCountries',
      'color: red; font-size:16px;',
      autocompleteList
    );
  };

  onSelectAutocomplete = (country) => {
    this.setState({ autocompleteValue: country.name, autocompleteList: [] });
  };

  renderAutocompleteList = () => {
    const { autocompleteList } = this.state;

    return autocompleteList.length > 0 ? (
      <div className={styles.AutocompleteList}>
        {autocompleteList.map((name) => (
          <div
            className={styles.AutocompleteListItems}
            key={`${name.name}`}
            role="presentation"
            onClick={() => this.onSelectAutocomplete(name)}
          >
            <strong>{name.boldNamePart}</strong>
            {name.restOfName}
          </div>
        ))}
      </div>
    ) : (
      false
    );
  };

  render() {
    const {
      worldCountryList,
      defaultCountriesList,
      selectedRow,
      autocompleteValue,
      givenForYourGoalPercentage,
      yourGoalName,
    } = this.state;
    const netMoneySum = 0.9;

    console.log('this.state', this.state);
    console.log('selectedRow', selectedRow);

    const WorldDataRow = worldCountryList.map((country) => {
      const arrIndex = defaultCountriesList.findIndex(
        (defaultCountry) => defaultCountry.name === country.name
      );

      const averageNetIncome = defaultCountriesList[arrIndex]?.averageNetIncome;
      const givenForYourGoal =
        (defaultCountriesList[arrIndex]?.averageNetIncome *
          givenForYourGoalPercentage) /
        100;
      const proYourGoalPopPercentage =
        defaultCountriesList[arrIndex]?.proYourGoalPopPercentage;
      const ageGroup20To64 = defaultCountriesList[arrIndex]?.ageGroup20To64;
      const techSavvyPopPercentage =
        defaultCountriesList[arrIndex]?.techSavvyPopPercentage;
      const willingToPay = defaultCountriesList[arrIndex]?.willingToPay;
      const finalPopWillingToPayPercentage =
        defaultCountriesList[arrIndex]?.proYourGoalPopPercentage *
        defaultCountriesList[arrIndex]?.ageGroup20To64 *
        defaultCountriesList[arrIndex]?.techSavvyPopPercentage *
        defaultCountriesList[arrIndex]?.willingToPay;
      const finalPopWillingToPay =
        country.population * finalPopWillingToPayPercentage;
      const finalTotalSum =
        givenForYourGoal * netMoneySum * finalPopWillingToPay;

      return arrIndex !== -1 ? (
        <tr key={country.name}>
          <td>{country.name}</td>
          <td className={styles.Wide}>
            {country.population.toLocaleString({
              maximumFractionDigits: 0,
            })}
          </td>
          <td>
            {selectedRow !== country.name ? (
              `$${averageNetIncome.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}`
            ) : (
              <>
                <span>$</span>
                <input
                  autoFocus
                  key={this.name}
                  value={`${averageNetIncome}`}
                  onChange={(event) =>
                    this.InputChangeHandler(event, arrIndex, 'averageNetIncome')
                  }
                  className={styles.WideInput}
                />
              </>
            )}
          </td>
          <td>{`$${givenForYourGoal.toFixed()}`}</td>
          <td>
            {selectedRow !== country.name ? (
              `${proYourGoalPopPercentage * 100}%`
            ) : (
              <>
                <input
                  key={this.name}
                  value={`${proYourGoalPopPercentage * 100}`}
                  onChange={(event) =>
                    this.InputChangeHandler(
                      event,
                      arrIndex,
                      'proYourGoalPopPercentage'
                    )
                  }
                  className={styles.Input}
                />
                <span>%</span>
              </>
            )}
          </td>
          <td>
            {selectedRow !== country.name ? (
              `${ageGroup20To64 * 100}%`
            ) : (
              <>
                <input
                  key={defaultCountriesList.ageGroup20To64}
                  onChange={(event) =>
                    this.InputChangeHandler(event, arrIndex, 'ageGroup20To64')
                  }
                  className={styles.Input}
                  value={`${ageGroup20To64 * 100}`}
                />
                <span>%</span>
              </>
            )}
          </td>
          <td>
            {selectedRow !== country.name ? (
              `${techSavvyPopPercentage * 100}%`
            ) : (
              <>
                <input
                  key={defaultCountriesList.techSavvyPopPercentage}
                  onChange={(event) =>
                    this.InputChangeHandler(
                      event,
                      arrIndex,
                      'techSavvyPopPercentage'
                    )
                  }
                  className={styles.Input}
                  value={`${techSavvyPopPercentage * 100}`}
                />
                <span>%</span>
              </>
            )}
          </td>
          <td>
            {selectedRow !== country.name ? (
              `${willingToPay * 100}%`
            ) : (
              <>
                <input
                  key={defaultCountriesList.willingToPay}
                  onChange={(event) =>
                    this.InputChangeHandler(event, arrIndex, 'willingToPay')
                  }
                  className={styles.Input}
                  value={`${willingToPay * 100}`}
                />
                <span> %</span>
              </>
            )}
          </td>
          <td>{`${netMoneySum * 100}%`}</td>
          <td>{`${(finalPopWillingToPayPercentage * 100).toFixed(2)}%`}</td>
          <td>
            {finalPopWillingToPay.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </td>
          <td className={styles.Wide}>
            <strong>{`$${finalTotalSum.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}`}</strong>
          </td>
          <td className={styles.Wide}>
            <strong>{`$${(finalTotalSum * 12).toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}`}</strong>
          </td>
          <td>
            <button
              style={
                selectedRow !== country.name
                  ? { backgroundColor: '#ffc107' }
                  : { backgroundColor: '#4caf50' }
              }
              type="button"
              name={country.name}
              onClick={() => this.editRowToggle(country.name)}
            >
              {selectedRow !== country.name ? 'Edit' : 'Save'}
            </button>
            <button
              style={{ backgroundColor: '#ff00009e' }}
              type="button"
              onClick={() => this.deleteRow(country.name)}
            >
              Delete
            </button>
          </td>
        </tr>
      ) : (
        false
      );
    });

    return (
      <div>
        <h4 className={styles.H4_GivenForYourGoal}>
          {`% FUNDING GIVEN FOR ${yourGoalName}, per month: `}
          <input
            className={styles.InputGivenForYourGoal}
            value={givenForYourGoalPercentage}
            onChange={(event) => {
              this.givenForYourGoalChangeHandler(event);
            }}
            onBlur={() =>
              this.onBlurTransformPercentNums(givenForYourGoalPercentage)
            }
          />
          <span> %</span>
        </h4>
        <h4 className={styles.H4_GivenForYourGoal}>
          YOUR GOAL:{' '}
          <input
            className={styles.InputGivenForYourGoal}
            value={yourGoalName}
            placeholder="Build my own space colony"
            onChange={(event) => {
              this.yourGoalNameChangeHandler(event);
            }}
          />
          <span> %</span>
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table ref={this.startOfTable} className={styles.Table}>
            <tbody>
              <tr>
                <th>Nation</th>
                <th>Population</th>
                <th>Average Monthly Net Income</th>
                <th>
                  {`${givenForYourGoalPercentage}% OF INCOME GIVEN FOR ${yourGoalName}`}
                </th>
                <th>{`PRO ${yourGoalName} POP`}</th>
                <th>20-60 AGE GROUP %</th>
                <th>POP BEING TECH SAVVY</th>
                <th>{`WILLING TO PAY FOR ${yourGoalName}`}</th>
                <th>
                  {`% FINAL DONATION GOING TOWARD ${yourGoalName} (REMOVING FEES, ETC)`}
                </th>
                <th>FINAL % OF TOTAL POP WILLING TO PAY</th>
                <th>FINAL POP WILLING TO PAY</th>
                <th>TOTAL SUM GATHERED, BY NATION, PER MONTH</th>
                <th>TOTAL SUM GATHERED, BY NATION, PER YEAR</th>
              </tr>
              {WorldDataRow}
            </tbody>
          </table>
        </div>
        <div className={styles.AddNew}>
          <input
            type="text"
            placeholder="e.g. United States of America"
            value={autocompleteValue}
            onChange={(event) => {
              window.scrollTo(0, document.body.scrollHeight);
              this.autocomplete(event);
            }}
          />
          <button
            className={styles.Button}
            type="submit"
            onClick={() => this.selectedCountryExists(autocompleteValue)}
          >
            {' '}
            Add new country
          </button>
        </div>
        {this.renderAutocompleteList()}
      </div>
    );
  }
}

export default WorldDataTable;

// TODO:
// 1. user can change % given for your goal ✔️
// 2. prologue text --- meh ❌
// 3. validate numeric input that have a max of 100 and min of 0 ✔️
// 4. replace comma (,) with a dot (.) for decimal numbers (or else they result in NaN) ✔️
