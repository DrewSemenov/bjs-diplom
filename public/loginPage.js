'use strict';

const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
  ApiConnector.login(data, (response) => {
    if (response.success) {
      location.reload();
    }

    userForm.setLoginErrorMessage(response.error ?? 'Авторизация выполнена');
  });
};

userForm.registerFormCallback = (data) => {
  ApiConnector.register(data, (response) => {
    if (response.success) {
      location.reload();
    }

    userForm.setRegisterErrorMessage(
      response.error ?? 'Регистрация пользователя'
    );
  });
};
