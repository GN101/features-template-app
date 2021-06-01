import React, { Component } from 'react';
import axios from 'axios';
import styles from './WorldDataTable.module.css';
import defaultCountries from '../../mockedData';

class WorldDataTable extends Component {
  state = {
    worldCountryList: [],
    isEditing: false,
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

  editRowToggle = (id) => {
    const { isEditing } = this.state;

    !isEditing
      ? this.setState({ isEditing: true })
      : this.setState({ isEditing: false });
  };

  saveRow = () => {};

  render() {
    const { isEditing, worldCountryList } = this.state;
    const givenForYourGoalPercentage = 0.01;
    const netMoneySum = 0.9;

    console.log('worldCountryList ::::', worldCountryList);

    const WorldDataRow = worldCountryList.map((country) => {
      const index = defaultCountries.findIndex(
        (defaultCountry) => defaultCountry.name === country.name
      );
      console.log(defaultCountries[index]);

      const averageNetIncome = defaultCountries[
        index
      ]?.averageNetIncome.toFixed();
      const givenForYourGoal = (
        defaultCountries[index]?.averageNetIncome * givenForYourGoalPercentage
      ).toFixed();
      const proYourGoalPopPercentage =
        defaultCountries[index]?.proYourGoalPopPercentage;
      const ageGroup20To64 = defaultCountries[index]?.ageGroup20To64;
      const techSavvyPopPercentage =
        defaultCountries[index]?.techSavvyPopPercentage;
      const willingToPay = defaultCountries[index]?.willingToPay;
      const finalPopWillingToPayPercentage =
        defaultCountries[index]?.proYourGoalPopPercentage *
        defaultCountries[index]?.ageGroup20To64 *
        defaultCountries[index]?.techSavvyPopPercentage *
        defaultCountries[index]?.willingToPay;
      const finalPopWillingToPay =
        country.population * finalPopWillingToPayPercentage;
      const finalTotalSum =
        givenForYourGoal * netMoneySum * finalPopWillingToPay;

      return index !== -1 ? (
        <tr key={country.name}>
          <td>{country.name}</td>
          <td className={styles.Wide}>
            {country.population.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </td>
          <td>{`$${averageNetIncome}`}</td>
          <td>{`$${givenForYourGoal}`}</td>
          <td>
            {!isEditing ? (
              `${proYourGoalPopPercentage * 100}%`
            ) : (
              <input
                className={styles.Input}
                value={`${proYourGoalPopPercentage * 100}%`}
              />
            )}
          </td>
          <td>
            {!isEditing ? (
              `${ageGroup20To64 * 100}%`
            ) : (
              <input
                className={styles.Input}
                value={`${ageGroup20To64 * 100}%`}
              />
            )}
          </td>
          <td>
            {!isEditing ? (
              `${techSavvyPopPercentage * 100}%`
            ) : (
              <input
                className={styles.Input}
                value={`${techSavvyPopPercentage * 100}%`}
              />
            )}
          </td>
          <td>
            {!isEditing ? (
              `${willingToPay * 100}%`
            ) : (
              <input
                className={styles.Input}
                value={`${willingToPay * 100}%`}
              />
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
              type="button"
              name={country.name}
              onClick={() => this.editRowToggle(country.name)}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button type="button">Delete</button>
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
          <input value={` ${givenForYourGoalPercentage * 100}%`} />
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
          </tbody>
        </table>
      </div>
    );
  }
}

export default WorldDataTable;
