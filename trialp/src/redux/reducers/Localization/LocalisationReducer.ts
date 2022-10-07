export const initialState = {
    defaultLanguage: 'EN',
    selectedLanguage: 'RU'
}

export function reducer(state: any, action: any) {
    const { type, payload } = action;
    switch (type) {
        case 'LANGUAGE_UPDATE': {
            return { ...state, selectedLanguage: payload };
        }
        default: return state;
    }
}