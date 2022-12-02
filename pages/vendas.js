import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import db from "../utils/db";
import Venda from "../Models/Venda";

import Nav from "../components/nav";
import Header from "../components/header";
import NovaVenda from "../components/novaVenda";
import EditarVenda from "../components/editarVenda";
import ExcluirItem from "../components/excluirItem";

import { RiDeleteBin2Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";

export default function Vendas({ vendas }) {
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirEditar, setAbrirEditar] = useState(false);
  const [abrirExcluir, setAbrirExcluir] = useState(false);
  const [idProduto, setIdProduto] = useState("");
  const [busca, setBusca] = useState("");
  const [produtoFiltrado, setProdutoFiltrado] = useState();

  const router = useRouter();

  useEffect(() => {
    const buscando = vendas?.filter((produto) =>
      produto.produto.toLowerCase().includes(busca.toLowerCase())
    );
    setProdutoFiltrado(buscando);
  }, [busca, vendas, abrirExcluir]);


  function Editar(id) {
    setIdProduto(id);
    setAbrirEditar(true);
  }

  function ModalExcluir(id) {
    setIdProduto(id);
    setAbrirExcluir(true);
  }

  return (
    <div>
      <Nav />
      <Header
        title='Vendas'
        abrir={() => setAbrirModal(true)}
        nomeBotao='Nova Venda'
        busca={setBusca}
      />

      <div className='pl-48 mt-5 '>
        {vendas.length !== 0 ? (
          <table className='w-full '>
            <thead className='bg-slate-100'>
              <tr>
                <th className='p-5 w-1/6  text-center'>Produto</th>
                <th className='p-5 w-1/6  text-center'>Valor de Custo</th>
                <th className='p-5 w-1/6  text-center'>Valor de Venda</th>
                <th className='p-5 w-1/6  text-center'>Última venda</th>
                <th className='p-5 w-1/6  text-center'>Quantidade de vendas</th>
                <th className='p-5 w-1/6  text-center'>#</th>
              </tr>
            </thead>
            <tbody className='bg-slate-50'>
              {produtoFiltrado
                ? produtoFiltrado.map((produto) => (
                    <tr key={produto._id}>
                      <td className='p-5 w-1/6  text-center'>
                        {produto.produto}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        R$ {produto.valorCusto}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        R$ {produto.valorVenda}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        R$ {produto.criadoEm}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        {produto.quantidade}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        <button
                          className='mr-5'
                          onClick={() => Editar(produto._id)}
                        >
                          <BiEditAlt className='fill-slate-800' size={25} />
                        </button>
                        <button onClick={() => ModalExcluir(produto._id)}>
                          <RiDeleteBin2Line
                            className='fill-red-900'
                            size={25}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                : vendas.map((produto) => (
                    <tr key={produto._id}>
                      <td className='p-5 w-1/6  text-center'>
                        {produto.produto}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        R$ {produto.valorCusto}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        R$ {produto.valorVenda}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        {produto.criadoEm}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        {produto.quantidade}
                      </td>
                      <td className='p-5 w-1/6  text-center'>
                        <button
                          className='mr-5'
                          onClick={() => Editar(produto._id)}
                        >
                          <BiEditAlt className='fill-slate-800' size={25} />
                        </button>
                        <button onClick={() => ModalExcluir(produto._id)}>
                          <RiDeleteBin2Line
                            className='fill-red-900'
                            size={25}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        ) : (
          <h1 className='font-bold p-5 text-xl'>
            Não há vendas realizadas!
          </h1>
        )}
      </div>
      {abrirExcluir && (
        <ExcluirItem
          rota={`api/vendas/excluirVenda/${idProduto}`}
          atualizar={"/vendas"}
          fechar={() => setAbrirExcluir(false)}
        />
      )}
      {abrirModal && (
        <>
          <NovaVenda click={() => setAbrirModal(false)} />
        </>
      )}

      {abrirEditar && (
        <>
          <EditarVenda id={idProduto} click={() => setAbrirEditar(false)} />{" "}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const vendas = await Venda.find().sort({ updatedAt: -1 }).lean();
  return {
    props: {
      vendas: vendas.map(db.convertDocToObj) ,
    },
  };
}



