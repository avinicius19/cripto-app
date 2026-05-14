import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Coinprop } from "../home";
import styles from './detal.module.css'


interface ResponseData {
  data: Coinprop
}

interface ErrorData {
  error: string
}

type DataProps = ResponseData | ErrorData;

const Detail = () => {

  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<Coinprop>()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=b7b1b70b091ae8197d45bfb34aeb8a96e4be6d2be4836e805678a3d4ca3c2c52`)
          .then(response => response.json())
          .then((data: DataProps) => {
            /* console.log(data); */

            if ('error' in data) {
              navigate('/')
              return;
            }

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

            const resultData = {
              ...data.data,
              formatedPrice: realPrice.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
            }

            console.log(resultData);
            setCoin(resultData);
            setLoading(false);

          })
      }
      catch (err) {
        console.log(err)
        navigate('/');
      }
    }
    getCoin();
  }, [cripto])

  if (loading || !coin) {
    return (
      <div className={styles.container} ><h4 className={styles.center} >Carregando detalhes</h4></div>
    )
  }

  return (
    <div className={styles.container} >
      <h1 className={styles.center} >{coin?.name}</h1>
      <h1 className={styles.center} >{coin?.symbol}</h1>

      <section className={styles.content}>
        <img src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}@2x.png`} alt="Logo da moeda" className={styles.logo} />

        <h1>{coin?.name}  {coin?.symbol}</h1>
        <p><strong>Preço: </strong>{coin?.formatedPrice}</p>
        <a><strong>Mercado: </strong>{coin?.formatedMarket}</a>
        <a><strong>Volume: </strong>{coin?.formatedVolume}</a>
        <a><strong>Mudança 24h: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>{Number(coin?.changePercent24Hr).toFixed(2)}</span></a>
      </section>
    </div >
  )
}

export default Detail

/* useEffect com uma async function dentro para realizar um req http com as propriedades inteiras da moeda selecionada */
