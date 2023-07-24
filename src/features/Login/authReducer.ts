import {Dispatch} from 'redux'
import {
    isInitializedActionType,
    isInitializedsAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodosDataAC, ClearTodosDataActionType} from "../TodolistsList/todolists-reducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        const e = error as { message: string }
        handleServerNetworkError(e, dispatch)
    }
}

export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.logOut()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(clearTodosDataAC())
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        const e = error as { message: string }
        handleServerNetworkError(e, dispatch)
    }
}

export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        const e = error as { message: string }
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(isInitializedsAC(true))
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | isInitializedActionType
    | ClearTodosDataActionType
