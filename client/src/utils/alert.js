import { notification } from 'antd';

export function successMsg(title, message) {
  notification.success({
    message: title,
    description: message,
  });
}

export function errorMsg(title, message) {
  notification.error({
    message: title,
    description: message,
  });
}

export function warnMsg(title, message) {
  notification.warning({
    message: title,
    description: message,
  });
}

export function infoMsg(title, message) {
  notification.info({
    message: title,
    description: message,
  });
}