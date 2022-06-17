import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { gql } from "@apollo/client";
import client from "../apollo-client";
import { Button, Table, Image, Space, Popover } from "antd"
import moment from 'moment';
import { AiFillEye } from "react-icons/ai";


const popoverContent = (
  <div>
    Personelin detaylı görünümü için tıklayınız
  </div>
);

export default function Home(props) {

  const [tableData, setTableData] = useState([])

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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: () => (
        <Space size="middle">
          <Popover content={popoverContent}>
            <Button size='large' icon={<AiFillEye size={30} />} />
          </Popover>
        </Space>
      )
    },

  ];



  useEffect(() => {
    const tempArr = props.data.launchesPast.map((data, index) => {
      return {
        key: index,
        index: data.id,
        name: data.mission_name,
        date: moment(data.launch_date_local).format("DD/MM/YYYY"),
        image: data.ships.length !== 0 ? data.ships[0].image : null,
        address: data.rocket.rocket_name
      }
    })

    setTableData(tempArr)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <Table dataSource={tableData} columns={columns} />;

      </main>
    </div>
  )
}


export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 200){
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