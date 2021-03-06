import axios from 'axios';
import querystring from 'querystring';
import dateformat from 'dateformat';
import IBAN from 'iban';
import { isEmpty, groupBy } from 'underscore'
import { linkTo } from 'routes/root/routes/Banking/modules/banking';
import {
  getDebitAccountAvailableBalance,
  getPaymentType,
  getDebitAccountCurrency,
  getActualFullName,
  findTransferCharges,
  findPaymentCharges,
  isValidFullName,
  isValidDebitAmount,
  isValidDate,
  isValidChargesBeneficiary,
  getImmediateText,
} from 'routes/root/routes/Banking/routes/utils/commonUtils';
import { handleRequestException } from 'routes/root/routes/Banking/routes/utils/commonActions';
import {
  initProperOrderForm,
  getBeneficiaryName
} from '../utils/orderUtils';
import { handleOrderTransactionException } from '../utils/coommonOrderActions';

const INITIAL_ORDER_STATE = 'INITIAL_ORDER_STATE';
const CHANGE_ACTIVE_ORDER_TYPE = 'CHANGE_ACTIVE_ORDER_TYPE';
const INIT_NEW_TRANSFER_ORDER_FORM = 'INIT_NEW_TRANSFER_ORDER_FORM';
const INIT_NEW_PAYMENT_ORDER_FORM = 'INIT_NEW_PAYMENT_ORDER_FORM';
const RECEIVED_TRANSFER_ORDERS = 'RECEIVED_TRANSFER_ORDERS';
const RECEIVED_PAYMENT_ORDERS = 'RECEIVED_PAYMENT_ORDERS';
const RECEIVED_DOMESTIC_BANKS = 'RECEIVED_DOMESTIC_BANKS';
const SET_ORDER_DEBIT_ACCOUNT = 'SET_ORDER_DEBIT_ACCOUNT';
const SET_ORDER_CURRENCY = 'SET_ORDER_CURRENCY';
const SET_TRANSFER_ORDER_BENEFICIARY_BANK_TYPE = 'SET_TRANSFER_ORDER_BENEFICIARY_BANK_TYPE';
const SET_TRANSFER_ORDER_BENEFICIARY_NAME = 'SET_TRANSFER_ORDER_BENEFICIARY_NAME';
const SET_TRANSFER_ORDER_BENEFICIARY_ACCOUNT = 'SET_TRANSFER_ORDER_BENEFICIARY_ACCOUNT';
const SET_TRANSFER_ORDER_AMOUNT = 'SET_TRANSFER_ORDER_AMOUNT';
const SET_TRANSFER_ORDER_CHARGES_BENEFICIARY = 'SET_TRANSFER_ORDER_CHARGES_BENEFICIARY';
const SET_TRANSFER_ORDER_CHARGES = 'SET_TRANSFER_ORDER_CHARGES';
const CLEAR_TRANSFER_ORDER_CHARGES = 'CLEAR_TRANSFER_ORDER_CHARGES';
const SET_TRANSFER_ORDER_COMMENTS = 'SET_TRANSFER_ORDER_COMMENTS';
const SET_TRANSFER_ORDER_ASAP_START = 'SET_TRANSFER_ORDER_ASAP_START';
const SET_TRANSFER_ORDER_START_DATE = 'SET_TRANSFER_ORDER_START_DATE';
const SET_TRANSFER_ORDER_PERIODICITY = 'SET_TRANSFER_ORDER_PERIODICITY';
const SET_TRANSFER_ORDER_TIMES_OF_EXEC = 'SET_TRANSFER_ORDER_TIMES_OF_EXEC';
const SET_TRANSFER_ORDER_CUSTOM_TITLE = 'SET_TRANSFER_ORDER_CUSTOM_TITLE';
const SET_AVAILABLE_PAYMENT_ORDER_METHODS = 'SET_AVAILABLE_PAYMENT_ORDER_METHODS';
const SET_PAYMENT_ORDER_PAYMENT_METHOD = 'SET_PAYMENT_ORDER_PAYMENT_METHOD';
const SET_PAYMENT_ORDER_CHARGES = 'SET_PAYMENT_ORDER_CHARGES';
const SET_PAYMENT_ORDER_PAYENT_TYPE = 'SET_PAYMENT_ORDER_PAYENT_TYPE';
const SET_PAYMENT_ORDER_PAYMENT_CODE = 'SET_PAYMENT_ORDER_PAYMENT_CODE';
const SET_PAYMENT_ORDER_MAX_AMOUNT = 'SET_PAYMENT_ORDER_MAX_AMOUNT';
const SET_PAYMENT_ORDER_END_DATE = 'SET_PAYMENT_ORDER_END_DATE';
const CLEAR_NEW_ORDER_FORM = 'CLEAR_NEW_ORDER_FORM';
const VALIDATE_TRANSFER_ORDER_FORM = 'VALIDATE_TRANSFER_ORDER_FORM';
const VALIDATE_PAYMENT_ORDER_FORM = 'VALIDATE_PAYMENT_ORDER_FORM';
const CLEAR_TRANSFER_ORDER_FORM = 'CLEAR_TRANSFER_ORDER_FORM';
const SUCCESSFUL_ORDER_TRANSACTION = 'SUCCESSFUL_ORDER_TRANSACTION';
const UNSUCCESSFUL_ORDER_TRANSACTION = 'UNSUCCESSFUL_ORDER_TRANSACTION';
const REQUEST_ERROR = 'REQUEST_ERROR';

export const initializeOrderState = () => {
  return (dispatch, getState) => {
    dispatch({
      type: INITIAL_ORDER_STATE,
    });
  }
}

export const changeActiveOrderType = (selection, orderType) => {
  return (dispatch, getState) => {
    const ordersState = getState().orders;
    const subType = ordersState.activeOrder ? ordersState.activeOrder.subType : 'existing';
    dispatch({
      type: CHANGE_ACTIVE_ORDER_TYPE,
      payload: {
        orderType,
        selection,
        subType
      }
    });
    linkTo(`/banking/orders/${orderType}/${subType}`);
  }
}

export const linkToNewOrder = (activeOrder) => {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_ACTIVE_ORDER_TYPE,
      payload: {
        selection: activeOrder.selection,
        orderType: activeOrder.type,
        subType: 'new'
      }
    });
    initProperOrderForm(activeOrder.type, initNewTransferOrderForm, initNewPaymentOrderForm);
    linkTo(`/banking/orders/${activeOrder.type}/new`);
  }
}

export const initNewTransferOrderForm = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_NEW_ORDER_FORM
    });
    dispatch({
      type: INIT_NEW_TRANSFER_ORDER_FORM
    });
  }
}

export const initNewPaymentOrderForm = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_NEW_ORDER_FORM
    });
    dispatch({
      type: INIT_NEW_PAYMENT_ORDER_FORM
    });
    getPaymentMethods()(dispatch, getState);
  }
}

export const getTransferOrders = () => {
  return (dispatch, getState) => {
    return axios({
      method: 'get',
      url: 'http://localhost:26353/api/order/GetAllCustomerTransferOrders',
      withCredentials: true
    })
    .then((response) => {
      dispatch({
        type    : RECEIVED_TRANSFER_ORDERS,
        payload : response.data
      })
    })
    .catch((exception) => handleRequestException(exception, dispatch))
  }
}

export const getPaymentOrders = () => {
  return (dispatch, getState) => {
    return axios({
      method: 'get',
      url: 'http://localhost:26353/api/order/GetAllCustomerPaymentOrders',
      withCredentials: true
    })
    .then((response) => {
      dispatch({
        type    : RECEIVED_PAYMENT_ORDERS,
        payload : response.data
      })
    })
    .catch((exception) => handleRequestException(exception, dispatch))
  }
}

export const getDomesticBanks = () => {
  return (dispatch, getState) => {
    if (isEmpty(getState().transfers.newOrderForm.domesticBanks)) {
      return axios({
        method: 'get',
        url: 'http://localhost:26353/api/Bank/GetAllDomesticBanks',
        withCredentials: true,
      })
      .then((response) => {
        dispatch({
          type    : RECEIVED_DOMESTIC_BANKS,
          payload : response.data
        })
      })
      .catch((exception) => handleRequestException(exception, dispatch))
    }
  }
}

export const setOrderDebitAccount = (debitAccount, debitAccountType) => {
  return (dispatch, getState) => {
    const availableBalance = getDebitAccountAvailableBalance(debitAccountType, debitAccount, getState())
    const currency = getDebitAccountCurrency(debitAccountType, debitAccount, getState())
    dispatch({
      type: SET_ORDER_DEBIT_ACCOUNT,
      payload: {
        debitAccount,
        debitAccountType,
        availableBalance,
      }
    });
    dispatch({
      type: SET_ORDER_CURRENCY,
      payload: currency,
    });
    const activeOrder = getState().orders.activeOrder;
    if (activeOrder && activeOrder.type == 'payment') {
      dispatch({
        type: VALIDATE_PAYMENT_ORDER_FORM
      });
    } else {
      dispatch({
        type: VALIDATE_TRANSFER_ORDER_FORM
      });
    }
  }
}

export const setTransferOrderBeneficiaryBankType = (selection, bankType) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_BENEFICIARY_BANK_TYPE,
      payload: {
        selection,
        bankType
      }
    });
    dispatch({
      type: SET_TRANSFER_ORDER_BENEFICIARY_ACCOUNT,
      payload: {}
    });
    dispatch({
      type: SET_TRANSFER_ORDER_BENEFICIARY_NAME,
      payload: ''
    });
    if (bankType == 'agileBank') {
      dispatch({
        type: SET_TRANSFER_ORDER_CHARGES,
        payload: 0
      });
    } else {
      dispatch({
        type: CLEAR_TRANSFER_ORDER_CHARGES
      });
    }
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderBeneficiaryName = (fullName) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_BENEFICIARY_NAME,
      payload: fullName
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderBeneficiaryAccount = (account, type) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_BENEFICIARY_ACCOUNT,
      payload: {
        account,
        type
      }
    });
    const customerName = getBeneficiaryName(type, getState().orders.newOrderForm.beneficiaryBankType.value, getState());
    dispatch({
      type: SET_TRANSFER_ORDER_BENEFICIARY_NAME,
      payload: customerName
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderAmount = (amount) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_AMOUNT,
      payload: amount
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderChargesBeneficiary = (selection, beneficiary) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_CHARGES_BENEFICIARY,
      payload: {
        selection,
        beneficiary
      }
    });
    dispatch({
      type: SET_TRANSFER_ORDER_CHARGES
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderComments = (comments) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_COMMENTS,
      payload: comments
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderAsapStart = (isAsap) => {
  return (dispatch, getState) => {
    const immediateText = getImmediateText(getState().root.language);
    dispatch({
      type: SET_TRANSFER_ORDER_ASAP_START,
      payload: {
        isAsap,
        immediateText
      }
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderStartDate = (date, formattedDate) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_START_DATE,
      payload: {
        date,
        formattedDate
      }
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setPeriodicity = (selection, periodicity) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_PERIODICITY,
      payload:  {
        periodicity,
        selection
      }
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTimesOfExecution = (timesOfExecution) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_TIMES_OF_EXEC,
      payload: timesOfExecution
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const setTransferOrderCustomTitle = (title) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRANSFER_ORDER_CUSTOM_TITLE,
      payload: title
    });
    dispatch({
      type: VALIDATE_TRANSFER_ORDER_FORM
    });
  }
}

export const getPaymentMethods = () => {
  return (dispatch, getState) => {
    if (isEmpty(getState().orders.newOrderForm.availablePaymentMethods)) {
      return axios({
        method: 'get',
        url: 'http://localhost:26353/api/Payment/GetPaymentMethods',
        withCredentials: true,
      })
      .then((response) => {
        dispatch({
          type    : SET_AVAILABLE_PAYMENT_ORDER_METHODS,
          payload : response.data
        })
      })
      .catch((exception) => handleRequestException(exception, dispatch))
    }
  }
}

export const setPaymentOrderPaymentMethod = (paymentMethod) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PAYMENT_ORDER_PAYMENT_METHOD,
      payload: paymentMethod
    });
    dispatch({
      type: SET_PAYMENT_ORDER_CHARGES
    });
    const paymentType = getPaymentType(paymentMethod);
    dispatch({
      type: SET_PAYMENT_ORDER_PAYENT_TYPE,
      payload: paymentType
    });
    dispatch({
      type: SET_PAYMENT_ORDER_PAYMENT_CODE,
      payload: undefined
    });
    dispatch({
      type: VALIDATE_PAYMENT_ORDER_FORM
    });
  }
}

export const setPaymentOrderPaymentCode = (paymentCode) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PAYMENT_ORDER_PAYMENT_CODE,
      payload: paymentCode
    });
    dispatch({
      type: VALIDATE_PAYMENT_ORDER_FORM
    });
  }
}

export const setPaymentOrderMaxAmount = (amount) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PAYMENT_ORDER_MAX_AMOUNT,
      payload: amount
    });
    dispatch({
      type: VALIDATE_PAYMENT_ORDER_FORM
    });
  }
}

export const setPaymentOrderEndDate = (date, formattedDate) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PAYMENT_ORDER_END_DATE,
      payload: {
        date,
        formattedDate
      }
    });
    dispatch({
      type: VALIDATE_PAYMENT_ORDER_FORM
    });
  }
}

export const cancelTransferOrder = (orderId) => {
  return (dispatch, getState) => {
    return axios({
      method: 'post',
      url: 'http://localhost:26353/api/order/CancelTransferOrder',
      data: querystring.stringify({
        transferOrderId: Number(orderId),
        language: getState().root.language,
      }),
      withCredentials: true,
    })
    .then(() => {
      dispatch({
        type    : SUCCESSFUL_ORDER_TRANSACTION,
        payload : '/banking/orders/existing/transfer'
      })
    })
    .then(() => getTransferOrders()(dispatch, getState))
    .catch((exception) => handleRequestException(exception, dispatch))
  }
}

export const cancelPaymentOrder = (orderId) => {
  return (dispatch, getState) => {
    return axios({
      method: 'post',
      url: 'http://localhost:26353/api/order/CancelPaymentOrder',
      data: querystring.stringify({
        paymentOrderId: Number(orderId),
      }),
      withCredentials: true,
    })
    .then(() => {
      dispatch({
        type    : SUCCESSFUL_ORDER_TRANSACTION,
        payload : '/banking/orders/existing/payment'
      })
    })
    .then(() => getPaymentOrders()(dispatch, getState))
    .catch((exception) => handleRequestException(exception, dispatch))
  }
}

export const createTransferOrder = (newOrderForm) => {
  return (dispatch, getState) => {
    return axios({
      method: 'post',
      url: 'http://localhost:26353/api/order/CreateTransferOrder',
      data: querystring.stringify({
        customTitle: newOrderForm.customTitle.value,
        debitProductId: newOrderForm.debitAccount.value,
        creditProductId: newOrderForm.beneficiaryAccount.value,
        amount: newOrderForm.amount.value,
        currency: newOrderForm.currency.value,
        chargesBeneficiary: newOrderForm.chargesBeneficiary.value,
        nextExecutionDate: newOrderForm.startDate.asapTransaction ? dateformat(new Date(), 'dd/mm/yyyy') : newOrderForm.startDate.value,
        executionsLeft: newOrderForm.timesOfExecution.value,
        executionFrequency: newOrderForm.periodicity.value,
        state: true,
        comments: newOrderForm.comments,
        language: getState().root.language,
      }),
      withCredentials: true,
    })
    .then(() => {
      dispatch({
        type    : SUCCESSFUL_ORDER_TRANSACTION,
        payload : '/banking/orders/transfer/existing'
      })
    })
    .then(() => getTransferOrders()(dispatch, getState))
    .then(() => linkTo('/banking/orders/transfer/new/result'))
    .catch((exception) => handleOrderTransactionException(exception, '/banking/orders/transfer/new', dispatch))
    .then(() => linkTo('/banking/orders/transfer/new/result'))
  }
}

export const createPaymentOrder = (newOrderForm) => {
  return (dispatch, getState) => {
    return axios({
      method: 'post',
      url: 'http://localhost:26353/api/order/CreatePaymentOrder',
      data: querystring.stringify({
         debitProductId: newOrderForm.debitAccount.value,
         paymentMethod: newOrderForm.paymentSelections.paymentMethod,
         paymentCode: newOrderForm.paymentCode.value,
         expirationDate: newOrderForm.endDate.value,
         maxPaymentAmount: newOrderForm.maxAmount.value,
         state: true,
         currency: newOrderForm.currency.value,
         language: getState().root.language,
      }),
      withCredentials: true,
    })
    .then(() => {
      dispatch({
        type    : SUCCESSFUL_ORDER_TRANSACTION,
        payload : '/banking/orders/payment/existing'
      })
    })
    .then(() => getPaymentOrders()(dispatch, getState))
    .then(() => linkTo('/banking/orders/payment/new/result'))
    .catch((exception) => handleOrderTransactionException(exception, '/banking/orders/payment/new/', dispatch))
    .then(() => linkTo('/banking/orders/payment/new/result'))
  }
}

export const clearNewOrderForm = () => {
  return {
    type: CLEAR_NEW_ORDER_FORM,
  }
}

export const actions = {
  initializeOrderState,
  changeActiveOrderType,
  linkToNewOrder,
  initNewTransferOrderForm,
  initNewPaymentOrderForm,
  getTransferOrders,
  getPaymentOrders,
  getDomesticBanks,
  setOrderDebitAccount,
  setTransferOrderBeneficiaryName,
  setTransferOrderBeneficiaryAccount,
  setTransferOrderBeneficiaryBankType,
  setTransferOrderAmount,
  setTransferOrderChargesBeneficiary,
  setTransferOrderComments,
  setTransferOrderAsapStart,
  setTransferOrderStartDate,
  setPaymentOrderEndDate,
  setPeriodicity,
  setTimesOfExecution,
  setTransferOrderCustomTitle,
  setPaymentOrderPaymentMethod,
  setPaymentOrderPaymentCode,
  setPaymentOrderMaxAmount,
  cancelTransferOrder,
  cancelPaymentOrder,
  createTransferOrder,
  createPaymentOrder,
  clearNewOrderForm,
}

const ACTION_HANDLERS = {
  INITIAL_ORDER_STATE: (state, action) => {
    return {};
  },

  CHANGE_ACTIVE_ORDER_TYPE: (state, action) => {
    return {
      ...state,
      activeOrder: {
        type: action.payload.orderType,
        selection: action.payload.selection,
        subType: action.payload.subType,
      }
    };
  },

  INIT_NEW_TRANSFER_ORDER_FORM: (state, action) => {
    return {
      ...state,
      newOrderForm : {
        ...state.newOrderForm,
        debitAccount: {},
        currency: {},
        beneficiaryBankType: {},
        beneficiaryAccount: {},
        beneficiaryFullName: {},
        amount: {},
        chargesBeneficiary: {},
        comments: {
          value: '',
          correct: true
        },
        startDate: {},
        periodicity: {},
        timesOfExecution: {},
        customTitle: {},
        shouldProcess: false,
        linkToApprovalForm: '',
      }
    }
  },

  INIT_NEW_PAYMENT_ORDER_FORM: (state, action) => {
    return {
      ...state,
      newOrderForm : {
        ...state.newOrderForm,
        debitAccount: {},
        currency: {},
        availablePaymentMethods: [],
        paymentSelections: {},
        paymentCode: {},
        maxAmount: {},
        charges: {},
        endDate: {},
        shouldProcess: false,
        linkToApprovalForm: '',
      }
    }
  },

  RECEIVED_TRANSFER_ORDERS: (state, action) => {
    return {
      ...state,
      transferOrders: action.payload
    }
  },

  RECEIVED_PAYMENT_ORDERS: (state, action) => {
    return {
      ...state,
      paymentOrders: action.payload
    }
  },

  RECEIVED_DOMESTIC_BANKS: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        domesticBanks: action.payload,
      }
    }
  },

  SET_ORDER_DEBIT_ACCOUNT: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        debitAccount: {
          value: action.payload.debitAccount,
          availableBalance: action.payload.availableBalance,
          correct: action.payload != "",
          type: action.payload.debitAccountType
        }
      }
    }
  },

  SET_ORDER_CURRENCY: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        currency: {
          value: action.payload,
          correct: action.payload != "",
        }
      }
    }
  },

  SET_TRANSFER_ORDER_BENEFICIARY_BANK_TYPE: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        beneficiaryBankType: {
          value: action.payload.bankType,
          selection: action.payload.selection,
          correct: true
        }
      }
    }
  },

  SET_TRANSFER_ORDER_BENEFICIARY_NAME: (state, action) => {
    const beneficiaryFullName = getActualFullName(action.payload);
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        beneficiaryFullName: {
          value: beneficiaryFullName,
          correct: isValidFullName(beneficiaryFullName)
        }
      }
    }
  },

  SET_TRANSFER_ORDER_BENEFICIARY_ACCOUNT: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        beneficiaryAccount: {
          value: action.payload.account,
          type: action.payload.type,
          correct: IBAN.isValid(action.payload.account),
        }
      }
    }
  },

  SET_TRANSFER_ORDER_AMOUNT: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        amount: {
          value: action.payload,
          correct: isValidDebitAmount(action.payload, state.newOrderForm.debitAccount.availableBalance)
        }
      }
    }
  },

  SET_TRANSFER_ORDER_CHARGES_BENEFICIARY: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        chargesBeneficiary: {
          value: action.payload.beneficiary,
          selection: action.payload.selection,
          correct: isValidChargesBeneficiary(action.payload.beneficiary)
        }
      }
    }
  },

  SET_TRANSFER_ORDER_CHARGES: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        charges: {
          value: action.payload ? action.payload : findTransferCharges(state.newOrderForm.chargesBeneficiary.value),
          correct: true
        }
      }
    }
  },

  CLEAR_TRANSFER_ORDER_CHARGES: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        charges: {}
      }
    }
  },

  SET_TRANSFER_ORDER_COMMENTS: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        comments: {
          value: action.payload,
          correct: action.payload.length <= 100,
        }
      }
    }
  },

  SET_TRANSFER_ORDER_ASAP_START: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        startDate: {
          ...state.newOrderForm.date,
          asapTransaction: action.payload.isAsap,
          correct: action.payload.isAsap,
          value: undefined,
          asapText: action.payload.immediateText,
        }
      }
    }
  },

  SET_TRANSFER_ORDER_START_DATE: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        startDate: {
          ...state.newOrderForm.date,
          value: action.payload.date,
          asapOrder: false,
          asapText: undefined,
          view: action.payload.formattedDate,
          correct: isValidDate(action.payload.date)
        }
      }
    }
  },

  SET_TRANSFER_ORDER_PERIODICITY: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        periodicity: {
          value: action.payload.periodicity,
          selection: action.payload.selection,
          correct: true,
        }
      }
    }
  },

  SET_TRANSFER_ORDER_TIMES_OF_EXEC: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        timesOfExecution: {
          value: action.payload,
          correct: action.payload > 0
        }
      }
    }
  },

  SET_TRANSFER_ORDER_CUSTOM_TITLE: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        customTitle: {
          value: action.payload,
          correct: action.payload != '',
        }
      }
    }
  },

  SET_AVAILABLE_PAYMENT_ORDER_METHODS: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        paymentMethods: groupBy(action.payload, 'category'),
        availablePaymentMethods: [...action.payload].map(paymentMethod => paymentMethod.name)
      }
    }
  },

  SET_PAYMENT_ORDER_PAYMENT_METHOD: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        paymentSelections: {
          ...state.newOrderForm.paymentSelections,
          paymentMethod: action.payload
        }
      }
    }
  },

  SET_PAYMENT_ORDER_CHARGES: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        charges: {
          value : findPaymentCharges(state.newOrderForm.paymentMethods, state.newOrderForm.paymentSelections.paymentMethod),
          correct: true
        }
      }
    }
  },

  SET_PAYMENT_ORDER_PAYENT_TYPE: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        paymentSelections: {
          ...state.newOrderForm.paymentSelections,
          paymentType: action.payload,
        }
      }
    }
  },

  SET_PAYMENT_ORDER_PAYMENT_CODE: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        paymentCode: {
          value: action.payload,
          correct: !!action.payload == undefined ? undefined : true,
        }
      }
    }
  },

  SET_PAYMENT_ORDER_MAX_AMOUNT: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        maxAmount: {
          value: action.payload,
          correct: action.payload > 0
        }
      }
    }
  },

  SET_PAYMENT_ORDER_END_DATE: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        endDate: {
          ...state.newOrderForm.date,
          value: action.payload.date,
          view: action.payload.formattedDate,
          correct: isValidDate(action.payload.date)
        }
      }
    }
  },

  VALIDATE_TRANSFER_ORDER_FORM: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        shouldProcess: state.newOrderForm.debitAccount.correct &&
          state.newOrderForm.currency.correct &&
          state.newOrderForm.beneficiaryBankType.correct &&
          state.newOrderForm.beneficiaryAccount.correct &&
          state.newOrderForm.beneficiaryFullName.correct &&
          state.newOrderForm.amount.correct &&
          ((state.newOrderForm.beneficiaryBankType.value == 'agileBank' &&
           state.newOrderForm.beneficiaryAccount.type == 'isAccount') ||
          state.newOrderForm.chargesBeneficiary.correct) &&
          state.newOrderForm.comments.correct &&
          state.newOrderForm.startDate.correct &&
          state.newOrderForm.periodicity.correct &&
          state.newOrderForm.timesOfExecution.correct &&
          state.newOrderForm.customTitle.correct
      }
    }
  },

  VALIDATE_PAYMENT_ORDER_FORM: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        shouldProcess: state.newOrderForm.debitAccount.correct &&
          state.newOrderForm.currency.correct &&
          state.newOrderForm.paymentCode.correct &&
          state.newOrderForm.maxAmount.correct &&
          state.newOrderForm.charges.correct &&
          state.newOrderForm.endDate.correct
      }
    }
  },

  CLEAR_NEW_ORDER_FORM: (state, action) => {
    return {
      ...state,
      newOrderForm: undefined
    }
  },

  SUCCESSFUL_ORDER_TRANSACTION: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        result: true,
        linkToStart: action.payload
      }
    }
  },

  UNSUCCESSFUL_ORDER_TRANSACTION: (state, action) => {
    return {
      ...state,
      newOrderForm: {
        ...state.newOrderForm,
        result: false,
        errorMessage: action.payload.exception.response.data,
        linkToStart: action.payload.linkToStart
      }
    }
  },

  REQUEST_ERROR: (state, action) => {
    return {
      ...state,
      returnedError: action.payload
    }
  },
}

export default function transfersReducer (state = {}, action) {
   const handler = ACTION_HANDLERS[action.type]
   return handler ? handler(state, action) : state
}
