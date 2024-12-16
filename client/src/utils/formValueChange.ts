export default function formValueChange(
    value: string,
    isSubmitted: boolean,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setEmpty: React.Dispatch<React.SetStateAction<boolean>>,
    pattern?: RegExp,
    setInvalid?: React.Dispatch<React.SetStateAction<boolean>>,
    setIsEmailDuplicate?: React.Dispatch<React.SetStateAction<boolean>>,
   ) {
    setValue(value);

    if (isSubmitted) {
        // 값이 비어있는지 체크
        if (value) {
            setEmpty(false);
        } else {
            setEmpty(true);
        }
        if (pattern && setInvalid) {
            // 정규식 패턴과 일치하는지
            if (value.match(pattern)) {
                setInvalid(false);
            } else {
                setInvalid(true);
            }

        }

        if(setIsEmailDuplicate) {
            setIsEmailDuplicate(false);
        }
    }
};