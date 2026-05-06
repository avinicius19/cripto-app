import styles from './header.module.css'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className={styles.container}>
      <Link to='/'><img src={logo} alt="Logo cripto" /></Link>
    </header>
  )
}

export default Header