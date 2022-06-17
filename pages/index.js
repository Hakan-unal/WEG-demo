import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { gql } from "@apollo/client";
import client from "../apollo-client";
import { Button, Table, Image, Space, Popover } from "antd"
import moment from 'moment';
import { AiFillEye, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { parse } from 'graphql';
import { showNotification } from "../components/notification/main"

const popoverContent = (
  <div>
    Personelin detaylı görünümü için tıklayınız
  </div>
);

export default function Home(props) {

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)


  const handleRate = (type, ID, index) => {
    setLoading(true)
    const tempArr = [...tableData];


    switch (type) {
      case "increase":
        tempArr[index] = {
          ...tempArr[index],
          rate: tempArr[index].rate + 1
        }
        break;
      case "decrease":
        if (tempArr[index].rate === 0) showNotification("warning", "Uyarı", "Oy oranı 0'dan daha düşük değer olamaz :)")
        else {
          tempArr[index] = {
            ...tempArr[index],
            rate: tempArr[index].rate - 1
          }
        }
        break;
      default: console.log("hello world")

    }
    setTableData(tempArr)
    setLoading(false)
  }



  useEffect(() => {
    const tempArr = props.data.launchesPast.map((data, index) => {
      return {
        key: index,
        index: data.id,
        name: data.mission_name,
        date: moment(data.launch_date_local).format("DD/MM/YYYY"),
        image: data.ships.length !== 0 ? data.ships[0].image : null,
        address: data.rocket.rocket_name,
        rate: 0
      }
    })
    console.log(props.data.launchesPast)
    setTableData(tempArr)
    setLoading(false)
  }, [])


  const columns = [
    {
      title: 'Dahili No',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Görsel',
      key: 'image',
      dataIndex: 'image',
      render: (image) => (
        <Image alt='Resim yüklenmemiş' width={200} preview={false} src={image}></Image>
      ),
    },
    {
      title: 'Ad Soyad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Şirkete Giriş Tarihi',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Departman',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Oy',
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a, b) => a.rate - b.rate,

    },
    {
      title: 'İşlem',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => handleRate("increase", data.index, data.key)} size='large' icon={<AiOutlineArrowUp size={30} color="green" />} />
          <Button onClick={() => handleRate("decrease", data.index, data.key)} size='large' icon={<AiOutlineArrowDown color="red" size={30} />} />
        </Space>
      )
    },
    {
      title: 'Detay',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Popover content={popoverContent}>
            <Button size='large' icon={<AiFillEye size={30} />} />
          </Popover>
        </Space>
      )
    },

  ];


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <Table loading={loading} dataSource={tableData} columns={columns} />;

      </main>
    </div>
  )
}


export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10){
        id
        mission_name
        launch_date_local
        ships {
          name
          home_port
          image
        }
        rocket {
          rocket_name
        }
      }
    }
    `,
  });

  return {
    props: {
      data: data,
    },
  };
}