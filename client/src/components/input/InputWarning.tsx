type Params = {
    isEmpty: boolean,
    warningString: string,
    isSubmitted: boolean,
    isInvalid?: boolean,
}

export default function InputWarning({ isEmpty, warningString, isSubmitted, isInvalid }: Params) {
    return (
        (isInvalid || isEmpty) && isSubmitted ?
            <div className="inValid-alert">{warningString}</div> :
            null
    )
}