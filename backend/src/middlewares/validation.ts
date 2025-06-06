import { Joi } from 'celebrate';

const regexPassword = /[a-zA-Z0-9]{3,30}/;
const regexPhone =
  /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;

const idValidation = Joi.string().hex().required().length(24).messages({
  'string.empty': 'Идентификатор не может быть пустым',
  'string.hex':
    'Идентификатор должен содержать только шестнадцатеречные символы',
  'string.length': 'Идентификатор должен содержать ровно 24 символа',
  'any.required': 'Идентификатор пользователя обязателен в параметрах',
});

const checkIdValidation = {
  params: Joi.object().keys({
    id: idValidation,
  }),
};

const registerValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Поле имени не может быть пустым',
      'string.min': 'Минимальное число символов равно 2',
      'string.max': 'Максимальное число символов равно 30',
      'any.required': 'Поле имени обязательно для заполнения',
    }),
    lastName: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Поле имени не может быть пустым',
      'string.min': 'Минимальное число символов равно 2',
      'string.max': 'Максимальное число символов равно 30',
      'any.required': 'Поле имени обязательно для заполнения',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле адрес электронной почты не может быть пустым',
      'string.email': 'Введите корректный адрес электронной почты',
      'any.required': 'Поле адрес электронной почты обязательно для заполнения',
    }),
    password: Joi.string().required().regex(regexPassword).messages({
      'string.empty': 'Поле пароля не может быть пустым',
      'string.pattern.base': 'Пароль не соответствует требованиям',
      'any.required': 'Поле пароля обязательно для заполнения',
    }),
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле адрес электронной почты не может быть пустым',
      'string.email': 'Введите корректный адрес электронной почты',
      'any.required': 'Поле адрес электронной почты обязательно для заполнения',
    }),
    password: Joi.string().required().regex(regexPassword).messages({
      'string.empty': 'Поле пароля не может быть пустым',
      'string.pattern.base': 'Пароль не соответствует требованиям',
      'any.required': 'Поле пароля обязательно для заполнения',
    }),
  }),
};

const createContactValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Поле имени не может быть пустым',
      'string.min': 'Минимальное число символов равно 2',
      'string.max': 'Максимальное число символов равно 30',
      'any.required': 'Поле имени обязательно для заполнения',
    }),
    phone: Joi.string().required().regex(regexPhone).messages({
      'string.empty': 'Поле телефона не может быть пустым',
      'string.pattern.base': 'Введите корретный формат номера телефона',
      'any.required': 'Поле телефона обязательно для заполнения',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле адрес электронной почты не может быть пустым',
      'string.email': 'Введите корректный адрес электронной почты',
      'any.required': 'Поле адрес электронной почты обязательно для заполнения',
    }),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

export {
  checkIdValidation,
  registerValidation,
  loginValidation,
  createContactValidation,
};
