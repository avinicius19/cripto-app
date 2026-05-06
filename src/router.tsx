import { createBrowserRouter } from "react-router-dom";

import Home from './pages/home'
import Detail from './pages/detail'
import NotFound from './pages/notfound'
import Layout from "./components/layout";


const router = createBrowserRouter([
    {
        /* deixa o header fixo em todas as páginas */
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'detail/:cripto',
                element: <Detail />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
])

export { router }