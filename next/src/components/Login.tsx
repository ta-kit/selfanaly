"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';

// トークンを送信するためのインスタンスを生成
const http = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
})

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

    // CSRFトークンを取得し、ログインAPIにユーザー認証情報を含むPOSTリクエストを送信
    const postData = async () => {
        axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true }).then((res: any) => {
            // console.log(res);
            http.post('/api/login', {email, password, name}).then((res: any) => {
                // console.log(res);
                router.push('/');
            })
        });
    }

    return (
    <main>
        <input
            type="text"
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
            placeholder='email'
            onChange={(e) => {
                setEmail(e.target.value);
            }}
        /><br/>
        <input
            type="text"
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
            placeholder='password'
            onChange={(e) => {
                setPassword(e.target.value);
            }}
        />
        <input
            type="text"
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
            placeholder='name'
            onChange={(e) => {
                setName(e.target.value);
            }}
        />
        <div>
            <button
                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
                onClick={()=>{
                    postData();
                }}
            >送信</button>
        </div>
    </main>
  );
}
