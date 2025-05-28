import React, { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import {FaBtc,FaPayPal} from "react-icons/gi"
import { GiCash } from 'react-icons/gi'
import {RiVisaLine} from "react-icons/ri"
import toast from 'react-hot-toast'
import api from '../libs/apiCall'
import Loading from "../components/loading"
import Title from '../components/title'

const ICONS ={
  crypto:(
    <div className='w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full'><FaBtc size={26} /></div>
  ),

   "visa credit card":(
    <div className='w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full'><RiVisaLine size={26} /></div>
  ),

   cash:(
    <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'><GiCash size={26} /></div>
  ),

   paypal:(
    <div className='w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full'><FaPayPal size={26} /></div>
  )

}

const AccountPage = () => {

  const {user} = useStore((state)=>state);
  const [isOpen,setIsOpen]=useState(false);
  const [isOpenTransfer,setIsOpenTransfer]=useState(false);
  const [selectedAccount,setSelectedAccount]=useState("");
  const [data,setData]=useState([]);
  const [isLoading,setIsLoading]=useState(false);

  const fetchAccounts=async ()=>{
    try{
      const {data:res} = await api.get(`\account`);
      setData(res?.data);
    }catch(error){
      console.log(error);
      toast.error(error?.response?.data?.status === "auth_failed"){
        localStorage.removeItem("user");
        window.location.reload();

      }}finally{
        setIsLoading(false);
      }
    };


    useEffect(()=>{
      setIsLoading(true);
      fetchAccounts();
    },[]);

    if(isLoading){
      return <Loading />
    }

    return <>


    <div className="w-full py-10">
      <div className='flex items-center justify-center'>
        <Title title="Accounts Information" />
        <div className='flex items-center gap-4'>
          <button onClick={()=>setIsOpen(true)} className='py-1.5 px-2 rounded bg-black text-white flex items-center justify-center'> 
            
            <MdAdd size={22}/>
            <span className=''>Add</span>
          </button>

        </div>

      </div>

    </div>
    </>
  }
  return (
    <>

    <div className='w-full py-10'>
      <div className="flex items-center justify-center">

      </div>
      {
        data?.length === -0 ? (
          <>
          <div className='w-full flex items-center justify-center py-10 text-gray-600'>
            <span>No Account Found</span>
          </div>
          </>
        ):(
          <div className='w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6'>
            {
              data?.map((acc,index)=>(
                <div key={index} className='w-full h-48 flex gap-4 bg-gray-50 p-3 rounded shadow'>
                  <div>
                    {ICONS[acc?.account_name?.toLowerCase()]}
                    </div>
                    <div className='space-y-2 w-full'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <p className='text-black text-2xl font-bold'>{acc?.account_name}</p>
                          <MdVerifiedUser size={26} className="text-emerald-600 ml-1"/>
                          <div>
                            <AccountMenu addMoney={()=>handleOpenAddMoney(acc)}
                              transferMoney={()=>handleTransferMoney(acc)}/>

                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              ))
            }
            </div>
            
        )
      }

    </div>
    </>

  )


export default AccountPage
