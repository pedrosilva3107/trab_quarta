import styles from './Modal.module.css'

export default function Modal({ title, onClose, onSave, children }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.btnSave} onClick={onSave}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
