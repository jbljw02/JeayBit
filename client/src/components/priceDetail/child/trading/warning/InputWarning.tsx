import styles from '../../../../../styles/warning.module.css'

export default function InputWarning() {

    return (
        <div className={styles.warningContainer}>주문총액이 잔고를 초과했습니다</div>
    )
}