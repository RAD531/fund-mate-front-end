import { BASE_URL, registerUser, loginUser, getUser, updateProfilePicture, getLoanAdvertisements, getBancoOptions, getAccountTypeOptions } from '../api/fundMateApi.js';
import Cookies from 'js-cookie';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            toggleUserMode: "debtor",
            loanAdvertisements: null,
            bancoOptions: [],
            accountTypeOptions: [],
            notifications: [],
            loading: false,
            notificationPage: {
                message: null,
                confirmButtonText: null,
                confirmButtonPath: null
            }
        },
        actions: {

            setNotificationPage: (_message, _confirmButtonText, _confirmButtonPath) => {
                const notificationPageTemp = getStore().notificationPage;
                notificationPageTemp.message = _message
                notificationPageTemp.confirmButtonText = _confirmButtonText;
                notificationPageTemp.confirmButtonPath = _confirmButtonPath
                setStore({ notificationPage: notificationPageTemp });
            },

            resetNotificationPage: () => {
                const notificationPageTemp = getStore().notificationPage;
                notificationPageTemp.message = null
                notificationPageTemp.confirmButtonText = null
                notificationPageTemp.confirmButtonPath = null
                setStore({ notificationPage: notificationPageTemp });
            },

            setLoading: (operation) => {
                setStore({ loading: operation })
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
                if (getActions().valiateApiResponse(apiResponse, "Success, registration successful", true)) {
                    return true;
                }

                else {
                    return false;
                }
            },

            logInUser: async (payload) => {
                getActions().setLoading(true);
                const apiResponse = await loginUser(payload);
                getActions().setLoading(false);
                if (getActions().valiateApiResponse(apiResponse, "Success, login successful", true)) {
                    //store the user response in user object
                    apiResponse.access_token = "Bearer " + apiResponse.access_token;
                    setStore({ user: apiResponse });
                    console.log(getStore().user)
                    Cookies.set('sessionToken', apiResponse.access_token, { secure: true, expires: 1 })
                    Cookies.set('userID', apiResponse.user.userID);
                    return true;
                }

                else {
                    return false;
                }
            },

            getUser: async () => {
                getActions().setLoading(true);
                if (!Cookies.get('userID') || !getActions().hasAccessToken()) {
                    getActions().setLoading(false);
                    getActions().valiateApiResponse("Error: Failed to get user", "", true);
                    return false;
                }

                const apiResponse = await getUser(getStore().user.access_token, Cookies.get('userID'));
                getActions().setLoading(false);

                if (getActions().valiateApiResponse(apiResponse, "Success, got user", false)) {
                    setStore({ user: { ...getStore().user, user: apiResponse } });
                    return true;
                }

                else {
                    return false;
                }
            },

            updateProfilePicture: async (form_data) => {
                getActions().setLoading(true);
                if (!Cookies.get('userID') || !getActions().hasAccessToken()) {
                    getActions().setLoading(false);
                    getActions().valiateApiResponse("Error: Failed to get user", "", true);
                    return false;
                }

                const apiResponse = await updateProfilePicture(getStore().user.access_token, Cookies.get('userID'), form_data);
                getActions().setLoading(false);

                if (getActions().valiateApiResponse(apiResponse, "Success, updated profile picture", true)) {
                    return await getActions().getUser();
                }

                else {
                    return false;
                }
            },

            getLoanAdvertisements: async () => {
                getActions().setLoading(true);

                if (!getActions().hasAccessToken()) {
                    return false;
                }

                const apiResponse = await getLoanAdvertisements(getStore().user.access_token);
                getActions().setLoading(false);

                if (getActions().valiateApiResponse(apiResponse, "Success, fetched loan advertisements successfully", false)) {
                    setStore({ loanAdvertisements: apiResponse })
                    return true;
                }

                else {
                    return false;
                }
            },

            getBancoOptions: async () => {
                const apiResponse = await getBancoOptions();
                if (getActions().valiateApiResponse(apiResponse, "Success, bank options fetched from api", false)) {
                    setStore({ bancoOptions: apiResponse });
                    return;
                }
            },

            getAccountTypeOptions: async () => {
                const apiResponse = await getAccountTypeOptions();
                if (getActions().valiateApiResponse(apiResponse, "Success, account options fetched from api", false)) {
                    setStore({ accountTypeOptions: apiResponse });
                    return;
                }
            },

            getLocalStorageItem: (fileName) => {
                return JSON.parse(localStorage.getItem(fileName));
            },

            saveToLocalStorage: (fileName, data) => {
                localStorage.setItem(fileName, JSON.stringify(data));
            },

            hasAccessToken: () => {
                // Check if the user object exists and has an 'access_token' property
                if (getStore().user && getStore().user.access_token) {
                    return true;
                }

                else {
                    // Access token not found in the user object, check cookies
                    const storedAccessToken = Cookies.get('sessionToken');

                    if (storedAccessToken) {
                        // Access token found in local storage, update the user object
                        setStore({ user: { ...getStore().user, access_token: storedAccessToken } });
                        return true;
                    }

                    else {
                        // Neither user object nor local storage contains an access token
                        return false;
                    }
                }
            },

            toggleAndSaveUserMode: () => {
                const userMode = getStore().toggleUserMode;
                if (userMode == "debtor") {
                    setStore({toggleUserMode : 'lender'});
                    getActions().saveToLocalStorage('activeMode', userMode)
                } else {
                    setStore({toggleUserMode : 'debtor'});
                    getActions().saveToLocalStorage('activeMode', userMode)
                }
            },

            valiateApiResponse: (apiResponse, successMessage, showNotification) => {

                if (String(apiResponse).startsWith("Error:")) {
                    if (showNotification) {
                        getActions().pushNotfication(apiResponse, "danger");
                    }
                    return false;
                }

                else {
                    if (showNotification) {
                        getActions().pushNotfication(successMessage, "success");
                    }
                    return true;
                }
            }
        }
    }
}

export default getState;