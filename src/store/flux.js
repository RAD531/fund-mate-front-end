import { BASE_URL, registerUser, getBancoOptions, getAccountTypeOptions } from '../api/fundMateApi.js';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            bancoOptions: [],
            accountTypeOptions: [],
            notifications: [],
            loading: false
        },
        actions: {

            setLoading: (operation) => {
                setStore({loading: operation})
            }, 

            setNotificationTrigger: (trigger) => {
				const notificationStore = getStore().notification;
				notificationStore.triggerNotification = trigger;
				setStore(notificationStore);
				getActions().pushNotfication(notificationStore);
			},

			getNotifications: () => {
				return getStore().notifications;
			},

			pushNotfication: (_message, _notificationType) => {
				let today = new Date();
				let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

				let updatedNotifications = getActions().getNotifications();
				updatedNotifications.push({ message: _message, notificationType: _notificationType, id: getActions().getNotifications().length, time: currentTime });
				setStore({ notifications: updatedNotifications });
			},

			removeNotification: (id) => {
				const updatedNotifications = getStore().notifications.filter((notification) => notification.id !== id);
				setStore({ notifications: updatedNotifications });
			},

            registerUser: async (form_data) => {
                getActions().setLoading(true);
                const apiResponse = await registerUser(form_data);
                getActions().setLoading(false);
                if (getActions().valiateApiResponse(apiResponse, "Success, registration successfull")) {
                    return true;
                }
                
                else{
                    return false;
                }
            },

            getBancoOptions: async () => {
                const apiResponse = await getBancoOptions();
                if (getActions().valiateApiResponse(apiResponse, "Success, bank options fetched from api")) {
                    setStore({ bancoOptions: apiResponse });
                    return;
                }
            },
            
            getAccountTypeOptions: async () => {
                const apiResponse = await getAccountTypeOptions();
                if (getActions().valiateApiResponse(apiResponse, "Success, account options fetched from api")) {
                    setStore({ accountTypeOptions: apiResponse });
                    return;
                }
            },

            valiateApiResponse: (apiResponse, successMessage) => {

				if (String(apiResponse).startsWith("Error:")) {
					getActions().pushNotfication(apiResponse, "danger");
					return false;
				}

				else {
					getActions().pushNotfication(successMessage, "success");
					return true;
				}
			}
        }
    }
}

export default getState;