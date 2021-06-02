/* eslint-disable no-debugger */
import React, { Component } from 'react';
import axios from 'axios';
import styles from './WorldDataTable.module.css';
import defaultCountries from '../../mockedData';

class WorldDataTable extends Component {
  state = {
    worldCountryList: [],
    defaultCountriesList: defaultCountries,
    selectedRow: '',
  };

  componentDidMount() {
    const getWorldCountriesData = async () => {
      try {
        const res = await axios.get('https://restcountries.eu/rest/v2/all');
        console.log('res ::::', res);
        this.setState({ worldCountryList: res.data });
      } catch (e) {
        console.log(
          `Error during fetching World Countries Data with error: ${e}`
        );
      }
    };
    getWorldCountriesData();
  }

  InputChangeHandler = (event, index, targetedTd) => {
    const { defaultCountriesList } = this.state;
    const updatedCountriesList = defaultCountriesList;
    console.log('defaultCountriesList', defaultCountriesList);
    console.log('id', index);
    console.log('event', event.target);

    updatedCountriesList[index][targetedTd] = event.target.value / 100;
    this.setState({ defaultCountriesList: updatedCountriesList });
    console.log('updatedCountriesList', updatedCountriesList);
    console.log('this.state INSIDE HANDLER :::', defaultCountriesList[3]);
  };

  editRowToggle = (id) => {
    this.setState((prevState) => ({
      selectedRow: prevState.selectedRow === '' ? id : '',
    }));
    // const index = defaultCountriesList.findIndex(
    //   (country) => country.name === id
    // );
    // console.log('id', id);
    // console.log('index', defaultCountriesList[index]);
    // const updatedRow = defaultCountriesList[index];
    // console.log('updatedRow', updatedRow);
    // updatedRow.name = e.target.value;
  };

  deleteRow = (countryName) => {
    const { defaultCountriesList } = this.state;
    const updatedCountriesList = defaultCountriesList.filter(
      (row) => row.name !== countryName
    );
    console.log('index', countryName);
    console.log('updatedCountriesList', updatedCountriesList);
    console.log(`delete row with country name: ${countryName}`);
    this.setState((prevState) => ({
      defaultCountriesList: updatedCountriesList,
    }));
  };

  render() {
    const { worldCountryList, defaultCountriesList, selectedRow } = this.state;
    const givenForYourGoalPercentage = 0.01;
    const netMoneySum = 0.9;

    console.log('this.state', this.state);
    console.log('selectedRow', selectedRow);

    const WorldDataRow = worldCountryList.map((country) => {
      const index = defaultCountriesList.findIndex(
        (defaultCountry) => defaultCountry.name === country.name
      );
      // console.log(defaultCountriesList[index]);

      const averageNetIncome = defaultCountriesList[
        index
      ]?.averageNetIncome.toFixed();
      const givenForYourGoal = (
        defaultCountriesList[index]?.averageNetIncome *
        givenForYourGoalPercentage
      ).toFixed();
      const proYourGoalPopPercentage =
        defaultCountriesList[index]?.proYourGoalPopPercentage;
      const ageGroup20To64 = defaultCountriesList[index]?.ageGroup20To64;
      const techSavvyPopPercentage =
        defaultCountriesList[index]?.techSavvyPopPercentage;
      const willingToPay = defaultCountriesList[index]?.willingToPay;
      const finalPopWillingToPayPercentage =
        defaultCountriesList[index]?.proYourGoalPopPercentage *
        defaultCountriesList[index]?.ageGroup20To64 *
        defaultCountriesList[index]?.techSavvyPopPercentage *
        defaultCountriesList[index]?.willingToPay;
      const finalPopWillingToPay =
        country.population * finalPopWillingToPayPercentage;
      const finalTotalSum =
        givenForYourGoal * netMoneySum * finalPopWillingToPay;

      return index !== -1 ? (
        <tr key={country.name}>
          <td>
            <button
              type="button"
              name={country.name}
              onClick={() => this.editRowToggle(country.name)}
            >
              {selectedRow !== country.name ? 'Edit' : 'Save'}
            </button>
            <button type="button" onClick={() => this.deleteRow(country.name)}>
              Delete
            </button>
          </td>
          <td>{country.name}</td>
          <td className={styles.Wide}>
            {country.population.toLocaleString({
              maximumFractionDigits: 0,
            })}
          </td>
          <td>{`$${averageNetIncome}`}</td>
          <td>{`$${givenForYourGoal}`}</td>
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
                      index,
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
                    this.InputChangeHandler(event, index, 'ageGroup20To64')
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
                      index,
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
                    this.InputChangeHandler(event, index, 'willingToPay')
                  }
                  className={styles.Input}
                  value={`${willingToPay * 100}`}
                />
                <span>%</span>
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
        </tr>
      ) : (
        false
      );
    });

    return (
      <div>
        <h4 style={{ color: '#f44336' }}>
          % GIVEN FOR YOUR GOAL FUNDING, per month:
          <span>{` ${givenForYourGoalPercentage * 100}%`}</span>
        </h4>
        <table className={styles.Table}>
          <tbody>
            <tr>
              <th>Nation</th>
              <th>Population</th>
              <th>Average Monthly Net Income</th>
              <th>
                ${givenForYourGoalPercentage * 100}% OF INCOME GIVEN FOR YOUR
                GOAL
              </th>
              <th>PRO YOUR GOAL POP</th>
              <th>20-60 AGE GROUP %</th>
              <th>POP BEING TECH SAVVY</th>
              <th>WILLING TO PAY FOR YOUR GOAL</th>
              <th>% FINAL DONATION GOING TO YOUR GOAL (REMOVING FEES, ETC)</th>
              <th>FINAL % OF TOTAL POP WILLING TO PAY</th>
              <th>FINAL POP WILLING TO PAY</th>
              <th>TOTAL SUM GATHERED, BY NATION, PER MONTH</th>
              <th>TOTAL SUM GATHERED, BY NATION, PER YEAR</th>
            </tr>
            {WorldDataRow}
            <div>
              <input placeholder="e.g. United States of America" />
              <span> Add new country</span>
            </div>
          </tbody>
        </table>
      </div>
    );
  }
}

export default WorldDataTable;
