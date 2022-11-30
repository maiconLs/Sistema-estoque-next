import Produto from '../../models/Produto'
import Venda from '../../models/Venda'

import data from '../../utils/data'
import db from '../../utils/db'

const handler = async (req, res) => {
  await db.connect()

  await Produto.deleteMany()
  await Produto.insertMany(data.produtos)

  await Venda.deleteMany()
  await Venda.insertMany(data.produtos)
  await db.disconnect()
  res.send({ message: 'seeded successfully' })
}

export default handler