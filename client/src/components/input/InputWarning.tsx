type Params = {
    isInvalid: boolean,
    warningString: string,
}

export default function InputWarning({ isInvalid, warningString }: Params) {
    return (
        isInvalid ?
            <div className="inValid-alert">{warningString}</div> :
            null
    )
}