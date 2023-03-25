export function required(message = "You can't leave this field empty") {
    return (v) => !!v || message
}

export function min3(message = "You can't leave this field empty") {
    return (v) => v.length > 3 || message
}

export function nullable() {
    return (v) => v
}

export function dateValidation(value) {
    const currentDate = new Date()
    const givenDate = new Date(value)
    return givenDate >= currentDate || 'Incorrect Date'
}

export const requiredWithZero = (value) =>
    (+value >= 0 && value !== '') || "You can't leave this field empty"


export function requiredPercentage(message = "Percentage is not accurate!") {
    return (v) => !!v && v > 0 && v <= 100 || message
}

export function requiredArray(message = "You can't leave this field empty") {
    return (v) => !!v && v.length > 0 || message
}

export function email(message = "This email is not valid") {
    return (v) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || message
}

export function url(message = "This website url is not valid") {
    return (v) => {
        return (/^(http|https):\/\/www.[a-z]+[-.][a-z]+/.test(v)) ||
            (/^(http|https):\/\/[a-z]+[-.][a-z]+/.test(v)) ||
            (/^www.[a-z]+[-.][a-z]+/.test(v)) ||
            (/^[a-z]+[-.][a-z]+/.test(v)) ||
            message
    }
}