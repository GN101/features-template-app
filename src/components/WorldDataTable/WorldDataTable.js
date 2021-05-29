import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './WorldDataTable.module.css';
import defaultCountries from '../../mockedData';

const WorldDataTable = () => {
  const [worldCountryList, setWorldCountryList] = useState([]);

  useEffect(() => {
    const getWorldCountriesData = async () => {
      try {
        const res = await axios.get('https://restcountries.eu/rest/v2/all');
        console.log('res ::::', res);
        setWorldCountryList(res.data);
      } catch (e) {
        console.log(
          `Error during fetching World Countries Data with error: ${e}`
        );
      }
    };
    getWorldCountriesData();
  }, []);

  const givenForYourGoalPercentage = 0.01;
  const netMoneySum = 0.9;

  console.log('res ::::', worldCountryList);

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
    const finalPopWillingToPay = (
      country.population * finalPopWillingToPayPercentage
    ).toFixed();
    const finalTotalSum = (
      givenForYourGoal *
      netMoneySum *
      finalPopWillingToPay
    ).toFixed();

    return index !== -1 ? (
      <tr key={country.name}>
        <td>{country.name}</td>
        <td>{country.population}</td>
        <td>{`$ ${averageNetIncome}`}</td>
        <td>{`$${givenForYourGoal}`}</td>
        <td>{`${proYourGoalPopPercentage * 100}%`}</td>
        <td>{`${ageGroup20To64 * 100}%`}</td>
        <td>{`${techSavvyPopPercentage * 100}%`}</td>
        <td>{`${willingToPay * 100}%`}</td>
        <td>{`${netMoneySum * 100}%`}</td>
        <td>{`${(finalPopWillingToPayPercentage * 100).toFixed(2)}%`}</td>
        <td>{finalPopWillingToPay}</td>
        <td>{finalTotalSum}</td>
      </tr>
    ) : (
      false
    );
  });

  return (
    <div className={styles.Table}>
      <table>
        <tbody>
          <tr>
            <th>Nation</th>
            <th>Population</th>
            <th>Average Monthly Net Income</th>
            <th>X% OF INCOME GIVEN FOR YOUR GOAL</th>
            <th>{`PRO <YOUR GOAL> POP`}</th>
            <th>20-60 AGE GROUP %</th>
            <th>POP BEING TECH SAVVY</th>
            <th>{`WILLING TO PAY FOR <YOUR GOAL>`}</th>
            <th>{`% FINAL DONATION GOING TO <YOUR GOAL> (REMOVING FEES, ETC)`}</th>
            <th>FINAL % OF TOTAL POP WILLING TO PAY</th>
            <th>FINAL POP WILLING TO PAY</th>
            <th>TOTAL SUM GATHERED, BY NATION, PER MONTH</th>
          </tr>
          <tr></tr>
          {/* <tr>{defaultCountriesList}</tr> */}
          {WorldDataRow}
        </tbody>
      </table>
    </div>
  );
};

export default WorldDataTable;
