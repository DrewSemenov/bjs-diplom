'use strict';

// logout
const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });
};

// получение данных о пользователе
const current = ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

ratesBoard.getRates = () => {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
};

ratesBoard.getRates();
setInterval(ratesBoard.getRates, 60000);
