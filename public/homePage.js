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

// Операции с деньгами
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    }

    moneyManager.setMessage(
      response.success,
      response.error ?? `Пополнение баланса : ${data.amount} ${data.currency}`
    );
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  let targetAmount;

  ApiConnector.current((response) => {
    if (response.success) {
      targetAmount = response.data.balance[data.targetCurrency];
    }
  });

  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      targetAmount = response.data.balance[data.targetCurrency] - targetAmount;
      ProfileWidget.showProfile(response.data);
    }

    moneyManager.setMessage(
      response.success,
      response.error ??
        `Конвертация 
         ${data.fromAmount} ${data.fromCurrency} в ${targetAmount.toFixed(2)} ${
          data.targetCurrency
        }`
    );
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    }

    moneyManager.setMessage(
      response.success,
      response.error ??
        `Перевод выполнен 
      ${data.amount} ${data.currency}`
    );
  });
};

// Работа с избранным

const favoritesWidget = new FavoritesWidget();

favoritesWidget.getFavorites = () => {
  ApiConnector.getFavorites((response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    }
  });
};

favoritesWidget.getFavorites();

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    }

    favoritesWidget.setMessage(
      response.success,
      response.error ?? `${data.name} добален в избранное`
    );
  });
};

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    }

    favoritesWidget.setMessage(
      response.success,
      response.error ?? 'Пользователь успешно удалён'
    );
  });
};

