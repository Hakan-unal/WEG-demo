import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux"
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { gql } from "@apollo/client";
import client from "../apollo-client";
import { Button, Table, Image, Space, Popover } from "antd"
import moment from 'moment';
import { AiFillEye, AiOutlineArrowUp, AiOutlineArrowDown, AiFillGithub } from "react-icons/ai";
import { showNotification } from "../components/notification/main"
import { wrapper } from "../store/store";
import { addUser } from '../store/users/action';
import { useRouter } from "next/router"

const detailPopoverContent = (
  <div>
    Personelin detaylı görünümü için tıklayınız
  </div>
);

const githubPopoverContent = (
  <div>
    Uygulama kaynak kodu için tıklayınız
  </div>
);


export default function Home(props) {

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch();
  const router = useRouter()


  const handleRate = async (type, ID, index) => {
    setLoading(true)
    const tempArr = [...tableData];


    switch (type) {
      case "increase":
        await handlePostLog("click", "increaseButton")

        tempArr[index] = {
          ...tempArr[index],
          rate: tempArr[index].rate + 1
        }
        break;
      case "decrease":
        await handlePostLog("click", "decreaseButton")
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


  const handleDetail = async (data) => {
    await handlePostLog("click", "detailButton")
    fetch('api/user', { method: 'POST', body: JSON.stringify(data) })
      .then((res) => {
        dispatch(addUser(data))
        router.push("employee")
      })
  }

  const handlePostLog = (type, name) => {
    const data = {
      type: type,
      name: name,
      date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    }
    fetch('api/log', { method: 'POST', body: JSON.stringify(data) })
      .then((res) => {
        console.log(res)
      })
  }

  const handleGoGithub = () => {
    router.push("https://github.com/Hakan-unal/WEG-demo")

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
      render: (data) => (
        <Space size="middle">
          <Popover content={detailPopoverContent}>
            <Button onClick={() => handleDetail(data)} size="large" icon={<AiFillEye />} />
          </Popover>
        </Space>
      )
    },

  ];


  return (
    <>
      <Head>
        <title>Rate List</title>
        <meta name="description" content="Follow The White Rabbit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Popover content={githubPopoverContent}>
          <Button size='large' onClick={() => handleGoGithub()} icon={<AiFillGithub size={30} />}></Button>
        </Popover>
        <Table loading={loading} dataSource={tableData} columns={columns} />;

      </main>
    </>
  )
}


export const getStaticProps = wrapper.getStaticProps(store => async ({ preview }) => {
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
)

