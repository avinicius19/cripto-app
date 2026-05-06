import { Link, useNavigate } from 'react-router-dom';
import styles from './home.module.css'
import { BsSearch } from "react-icons/bs";
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react'


/* tipando os dados da api, pois o ts não sabe o que vem, sem isso ele imagina 'any' */
interface Coinprop {
  id: string,
  rank: string,
  symbol: string,
  name: string,
  supply: string,
  maxSupply: string,
  marketCapUsd: string,
  volumeUsd24Hr: string,
  priceUsd: string,
  changePercent24Hr: string,
  vwap24h: string,
  explorer: string,
  formatedPrice?: string,
  formatedMarket?: string,
  formatedVolume?: string
}

/* passando os dados como devem ser para o data */
interface DataProp {
  data: Coinprop[]
}


const Home = () => {

  const [input, setInput] = useState('');
  /* especifica como o array vem, mas NÃO passa os dados para ele */
  const [coins, setCoins] = useState<Coinprop[]>([]);
  const [offset, setOffSet] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input === '') return;

    navigate(`/detail/${input}`)
  }
  /* atualiza a cada offset alterado*/
  useEffect(() => {
    getData();
  }, [offset]);


  async function getData() {
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=b7b1b70b091ae8197d45bfb34aeb8a96e4be6d2be4836e805678a3d4ca3c2c52`)
      .then(response => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data;

        const realPrice = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        })

        const priceCompact = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          /* formatação compacta */
          notation: 'compact'
        })


        /* mantenho o que ja tem no array, porem adiciono os itens formatados */
        const addNewProperty = coinsData.map((propriedades) => {
          const addedProp = {
            ...propriedades,
            formatedPrice: realPrice.format(Number(propriedades.priceUsd)),
            formatedMarket: priceCompact.format(Number(propriedades.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(propriedades.volumeUsd24Hr))
          }

          return addedProp;
        })


        /* coins → acumulador global | addNewProperty → dados frescos da API */
        const listCoins = [...coins, ...addNewProperty]

        setCoins(listCoins);

        console.log(addNewProperty);

      })
  }

  const handleGetMore = () => {
    setOffSet(prev => prev + 10)
  }
  

  return (
    <main className={styles.container} >
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder='Digite o nome da moeda. Ex: Bitcoin' value={input} onChange={(e) => setInput(e.target.value)} />
        <button type='submit'>
          <BsSearch size={30} color='#FFF' />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
            <th scope='col'>Mudança 24h</th>
          </tr>
        </thead>

        <tbody id='tbody'>

          {coins.length > 0 && coins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label='Moeda'>
                <div className={styles.name} >
                  <img src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} alt="Logo Cripto" className={styles.logo} />
                  <Link to={`/detail/${item.id}`} ><span>{item.name}</span> | {item.symbol}</Link>
                </div>
              </td>

              <td className={styles.tdLabel} data-label='Valor mercado'>
                {item.formatedMarket}
              </td>

              <td className={styles.tdLabel} data-label='Preço'>
                {item.formatedPrice}
              </td>

              <td className={styles.tdLabel} data-label='Volume'>
                {item.formatedVolume}
              </td>

              <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label='Mudança'>
                <span> {Number(item.changePercent24Hr).toFixed(2)}</span>
              </td>
            </tr>
          ))}


        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>

    </main>
  )
}

export default Home


