"use client";
import { useRouter } from 'next/navigation'
import axios from 'axios';

// トークンを送信するためのインスタンスを生成
const http = axios.create({
    baseURL: 'http://localhost:8000',
})

export default function Home() {
    const router = useRouter();

    // ログアウト成功後、ローカルストレージからトークンを削除
    const logout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                await http.post('/api/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                localStorage.removeItem('authToken');
                // router.push('/login');
                console.log('seikou');
            } else {
                console.error('Logout failed: No authentication token found in localStorage. This could indicate that the user was not logged in or the token was already removed.');
            }
        } catch(error) {
            console.log(error);
        }
    };
    return (
        <main>
            <div className="text-sm font-bold underline">top</div>
            <div>
            <button
                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
                onClick={()=>{
                    logout();
                }}
            >ログアウト</button>
        </div>
        </main>
    );
}
