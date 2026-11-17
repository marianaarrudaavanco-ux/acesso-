import { Link } from 'react-router-dom'

export default function NaoEncontrado() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <p>
        Esse endereço não existe. <Link to="/">Voltar para as linhas</Link>
      </p>
    </>
  )
}
