import { notification } from 'antd';

notification.config({
    duration: 2.5,
    maxCount: 3,
    placement: "topRight"
});

export const showNotification = (type, title, description, style, icon) => {
    notification[type]({
        message: title,
        description: description,
        className: 'custom-class',
        style: style ? style : null,
        icon: icon ? icon : null,
    });
};
