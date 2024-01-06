import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home, Category, Artist, Music } from './view/user'
import icon from './asset/icon.png'
import { useEffect, useState } from 'react';
import * as api from './api'
import { BsSearch, BsBellFill } from 'react-icons/bs'
import { FiMail } from 'react-icons/fi'
import { GrClose } from 'react-icons/gr'
import { BiLogInCircle } from 'react-icons/bi'

function App() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(null)
  const [tab, setTab] = useState('home')
  const [info, setInfo] = useState({ account: '', password: '', name: '', otp: '' })
  const [loinging, setLoinging] = useState(JSON.parse(localStorage.getItem('musicApp'))?.loging)
  const [user, setUser] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [resultSearch, setResultSearch] = useState(null)
  const [temPath, setTemPath] = useState(null)
  const [showPlan, setShowPlan] = useState(false)

  useEffect(() => {
    (async () => {
      const cate = await api.Category.getAll()
      if (cate?.success) setCategories(cate?.data)
    })()
  }, [])
  useEffect(() => {
    if (loinging) {
      (async () => {
        const response = await api.Auth.getUser()
        response.success && setUser(response.mess)
      })()
    }
  }, [loinging])
  const changeTab = (tab, path) => {
    if (!loinging && tab !== 'home') {
      setShowPopup('signin')
    }
    else {
      setTab(tab)
      navigate(path)
    }
  }
  const handleSignIn = async () => {
    const ress = await api.Auth.signIn(info)
    ress.success && setLoinging(JSON.parse(localStorage.getItem('musicApp'))?.loging)
  }
  const handleSignUp = async () => {
    const ress = await api.Auth.signUp(info)
    ress.success && setShowPopup('signin')
  }
  const handleLogout = () => {
    localStorage.removeItem('musicApp')
    window.location.href = 'http://localhost:3000/'
  }
  const handleSentOTP = async () => {
    const response = await api.Auth.getOTP({ account: info.account })
    response.success && alert(`An OTP sent to your ${response.type}`)
  }
  const handleChangePassword = async () => {
    const response = await api.Auth.verifyOTP({ otp: info.otp, newPassword: info.password, account: info.account })
    alert(`Server warning: ${response.mes}`)
    response.success && setShowPopup('signin')
  }
  const handleUpgrate = async () => {
    const response = await api.Extend.upgratePlant()
    alert(response.mes)
    if (!response.success) return
    let local = JSON.parse(localStorage.getItem('musicApp'))
    local.accessToken = response.accessToken
    localStorage.setItem('musicApp', JSON.stringify(local))
  }
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchKey === '') return
      (async () => {
        const response = await api.Extend.search({ content: searchKey })
        response.success && setResultSearch(response.result)
        response.success && setTemPath(response.path)
      })()
    }, 600);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchKey]);
  return (
    <div className="App">
      <div className='fixed z-40 w-full bg-[#333333] h-[48px]'>
        <div className="flex mx-[12px] h-full text-center">
          <div onClick={() => navigate('/')} className="w-[5%] h-full bg-[#ff551a] cursor-pointer">
            <img className='w-[80%] mx-auto px-[4px]' src={icon} alt="icon" />
          </div>
          <div onClick={() => changeTab('home', '')} className={`w-[6%] ${tab === 'home' ? 'bg-[#111] text-[#fff]' : 'bg-[#333] text-[#ccc]'} flex items-center`}>
            <div className="w-full cursor-pointer">HOME</div>
          </div>
          {categories && categories.map((cate) => {
            return (
              <div key={cate._id} onClick={() => changeTab(cate.name, cate.path)} className={`w-[6%] ${tab === cate.name ? 'bg-[#111] text-[#fff]' : 'bg-[#333] text-[#ccc]'} flex items-center`}>
                <div className="w-full cursor-pointer">{cate.name.toUpperCase()}</div>
              </div>
            )
          })}
          <div className="w-[30%] flex items-center relative">
            <input value={searchKey} onChange={(e) => setSearchKey(e.target.value)} className='mx-[24px] w-full rounded-[4px] py-[2px] pl-3 bg-[#e5e5e5]' placeholder='search' type="text" />
            <BsSearch className='absolute top-[34%] right-[8%] text-[#666666]' />
          </div>
          <div className="flex items-center w-[42%]">
            <div onClick={() => setShowPlan(true)} className="text-[17px] font-[600] text-[#ff551a] w-[20%] cursor-pointer">Try Next Pro</div>
            {!loinging && <div className="w-[40%] text-[#ccc] tracking-[1.5px] cursor-pointer">
              <span onClick={() => setShowPopup('signin')} className='hover:text-[#ff551a]'>SignIn</span>
              <span>/</span>
              <span onClick={() => setShowPopup('signup')} className='hover:text-[#ff551a]'>SignUp</span>
            </div>}
            {(loinging && user) && <div className="w-[40%] text-[#ccc] tracking-[1.5px] cursor-pointer relative">
              <img className='h-[24px] w-[24px] rounded-[50%] absolute top-[8%] left-[10%] cover' src="https://png.pngtree.com/png-vector/20191026/ourlarge/pngtree-avatar-vector-icon-white-background-png-image_1870181.jpg" alt="img" />
              <span className='hover:text-[#ff551a]'>{user.name}</span>
            </div>}
            <div className="w-[40%] flex justify-evenly ">
              <BsBellFill size={22} color='#ccc' />
              <FiMail size={24} color='#ccc' />
              <BiLogInCircle className='cursor-pointer' onClick={() => handleLogout()} size={26} color='#ccc' />
            </div>
          </div>
        </div>
      </div>
      {showPlan && <div className="fixed z-50 bg-[#161616] top-0 left-0 right-0 bottom-0">
        <GrClose onClick={() => setShowPlan(false)} className='absolute top-[24px] right-[24px] cursor-pointer' color='#fff' size={22} />
        <div className="text-[40px] text-[#fff] font-[600] text-center py-[100px] bg-gradient-to-r from-[#fff7d9e6] via-[#ffda2ae6] via-[#b48305e6] to-[#4b3e01e6]"  >Sellect your plan</div>
        <div className=" flex pt-[40px] justify-around">
          <div onClick={() => handleUpgrate()} className="cursor-pointer bg-[#000] hover:bg-gradient-to-b from-[#493919] to-[#0f0c05] w-[20%] rounded-[20px]">
            <div className="w-[80%] pb-[60px] mx-auto text-[#fff]">
              <div className="text-[32px] font-[800] pt-[60px]">Max Socia</div>
              <div className="text-[#ccc]">Unlimited assets & apps for every type of use</div>
              <div className="py-[60px] ">
                <span className='text-[36px]'>$28.99</span>
                <span>/month</span>
                <div className="text-[#ccc]">Billed annually or $59.99 billed </div>
              </div>
              <div className="w-full rounded-[14px] text-center py-[8px] text-[#000] bg-gradient-to-r from-[#f6c056] to-[#ffeeb0] font-[500]">Selectionner</div>
            </div>
          </div>
          <div onClick={() => handleUpgrate()} className="cursor-pointer bg-[#000] hover:bg-gradient-to-b from-[#493919] to-[#0f0c05] w-[20%] rounded-[20px]">
            <div className="w-[80%] pb-[60px] mx-auto text-[#fff]">
              <div className="text-[32px] font-[800] pt-[60px]">Max Pro</div>
              <div className="text-[#ccc]">Unlimited assets & apps for every type of use</div>
              <div className="py-[60px] ">
                <span className='text-[36px]'>$68.99</span>
                <span>/month</span>
                <div className="text-[#ccc]">Billed annually </div>
              </div>
              <div className="w-full rounded-[14px] text-center py-[8px] text-[#000] bg-gradient-to-r from-[#f6c056] to-[#ffeeb0] font-[500]">Selectionner</div>
            </div>
          </div>
          <div onClick={() => handleUpgrate()} className="cursor-pointer bg-[#000] hover:bg-gradient-to-b from-[#493919] to-[#0f0c05] w-[20%] rounded-[20px]">
            <div className="w-[80%] pb-[60px] mx-auto text-[#fff]">
              <div className="text-[32px] font-[800] pt-[60px]">Max Team</div>
              <div className="text-[#ccc]">Unlimited assets & apps for every type of use</div>
              <div className="py-[60px] ">
                <span className='text-[36px]'>$99.68</span>
                <span>/month</span>
                <div className="text-[#ccc]">for 2 members, billed annually </div>
              </div>
              <div className="w-full rounded-[14px] text-center py-[8px] text-[#000] bg-gradient-to-r from-[#f6c056] to-[#ffeeb0] font-[500]">Selectionner</div>
            </div>
          </div>
          <div onClick={() => handleUpgrate()} className="cursor-pointer bg-[#000] hover:bg-gradient-to-b from-[#493919] to-[#0f0c05] w-[20%] rounded-[20px]">
            <div className="w-[80%] pb-[60px] mx-auto text-[#fff]">
              <div className="text-[32px] font-[800] pt-[60px]">Enterpise</div>
              <div className="text-[#ccc]">Unlimited assets & apps for every type of use</div>
              <div className="py-[60px] ">
                <span className='text-[36px]'>$120.00</span>
                <span>/month</span>
                <div className="text-[#ccc]">Covers your social channels </div>
              </div>
              <div className="w-full rounded-[14px] text-center py-[8px] text-[#000] bg-gradient-to-r from-[#f6c056] to-[#ffeeb0] font-[500]">Selectionner</div>
            </div>
          </div>
        </div>
      </div>}
      {searchKey !== '' && <div className="fixed z-30 top-0 bottom-0 right-0 left-0 bg-[#000]/[0.7]">
        <div className="mt-[48px] text-[#fff] mx-[30.4%] w-[26.5%] bg-[#333] p-[8px]">Searching for: {searchKey}</div>
        {(resultSearch && resultSearch.length !== 0) && resultSearch.map(result => {
          if (result?.author) result._id = result.author
          return (
            <div onClick={() => { navigate(temPath + result._id); setSearchKey('') }} className="border-b-2 border-[#fff] cursor-pointer text-[#fff] mx-[30.4%] w-[26.5%] bg-[#111] p-[8px]"><BsSearch className='inline' /> {result?.name}</div>
          )
        })}
        {(resultSearch && resultSearch.length === 0) && <div className="border-b-2 border-[#fff] cursor-pointer text-[#fff] mx-[30.4%] w-[26.5%] bg-[#111] p-[8px]"><BsSearch className='inline' /> no result...</div>}
      </div>}
      {(!loinging && showPopup === 'signin') && <div className="fixed flex z-50 top-0 bottom-0 left-0 right-0 bg-[#f2f2f2e6]/[.87] justify-center">
        <div className="bg-[#fff] w-[30%] h-[66%] mt-[5%] relative animate-popupShow">
          <GrClose onClick={() => setShowPopup(null)} className="absolute right-2 top-2 cursor-pointer" />
          <div className="text-[32px] text-center py-[32px]">START <br />flying to the Moon ^_^</div>
          <input onChange={(e) => setInfo({ ...info, account: e.target.value })} value={info.account} placeholder='Account...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="text" />
          <input onChange={(e) => setInfo({ ...info, password: e.target.value })} value={info.password} placeholder='Password...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="password" />
          <div onClick={() => handleSignIn()} className="cursor-pointer rounded-[4px] w-[80%] mx-auto py-[4px] text-[#fff] text-[20px] bg-[#ff551a] text-center">Sign In</div>
          <div className="text-[12px] mt-[12px] text-[#ccc] w-[80%] mx-auto">By signing in I accept the <span className='text-[#044dd2]'> Terms of Use</span>. I have read and understood the <span className='text-[#044dd2]'>Privacy Policy</span> and <span className='text-[#044dd2]'>Cookies Policy.</span></div>
          <div onClick={() => setShowPopup('forgot')} className="text-[12px] text-[#044dd2] font-[600] cursor-pointer w-[80%] mx-auto">forgot your password ?</div>
        </div>
      </div>}
      {(!loinging && showPopup === 'signup') && <div className="fixed flex z-50 top-0 bottom-0 left-0 right-0 bg-[#f2f2f2e6]/[.87] justify-center">
        <div className="bg-[#fff] w-[30%] h-[66%] mt-[5%] relative animate-popupShow">
          <GrClose onClick={() => setShowPopup(null)} className="absolute right-2 top-2 cursor-pointer" />
          <div className="text-[32px] text-center py-[32px]">START <br />create your LoundSound</div>
          <input onChange={(e) => setInfo({ ...info, account: e.target.value })} value={info.account} placeholder='Account...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="text" />
          <input onChange={(e) => setInfo({ ...info, password: e.target.value })} value={info.password} placeholder='Password...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="password" />
          <input onChange={(e) => setInfo({ ...info, name: e.target.value })} value={info.name} placeholder='Name...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="text" />
          <div onClick={() => handleSignUp()} className="cursor-pointer rounded-[4px] w-[80%] mx-auto py-[4px] text-[#fff] text-[20px] bg-[#ff551a] text-center">Sign Up</div>
          <div className="text-[12px] mt-[12px] text-[#ccc] w-[80%] mx-auto">By signing up I accept the <span className='text-[#044dd2]'> Terms of Use</span>. I have read and understood the <span className='text-[#044dd2]'>Privacy Policy</span> and <span className='text-[#044dd2]'>Cookies Policy.</span></div>
        </div>
      </div>}
      {(!loinging && showPopup === 'forgot') && <div className="fixed flex z-50 top-0 bottom-0 left-0 right-0 bg-[#f2f2f2e6]/[.87] justify-center">
        <div className="bg-[#fff] w-[30%] h-[66%] mt-[5%] relative animate-popupShow">
          <GrClose onClick={() => setShowPopup(null)} className="absolute right-2 top-2 cursor-pointer" />
          <div className="text-[32px] text-center py-[32px]">Don't worry<br />we provided forgot service</div>
          <input onChange={(e) => setInfo({ ...info, account: e.target.value })} value={info.account} placeholder='Account...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="text" />
          <div onClick={() => handleSentOTP()} className="cursor-pointer rounded-[4px] w-[80%] mx-auto py-[4px] text-[#fff] text-[20px] bg-[#1b5aec] text-center">Sent OTP</div>
          <input onChange={(e) => setInfo({ ...info, otp: e.target.value })} value={info.otp} placeholder='OTP...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="text" />
          <input onChange={(e) => setInfo({ ...info, password: e.target.value })} value={info.password} placeholder='Password...' className='block my-[24px] py-[4px] pl-[8px] rounded-[4px] w-[80%] border-2 border-[#ccc] mx-auto' type="text" />
          <div onClick={() => handleChangePassword()} className="cursor-pointer rounded-[4px] w-[80%] mx-auto py-[4px] text-[#fff] text-[20px] bg-[#ff551a] text-center">Verrify with new password</div>
          <div className="text-[12px] mt-[12px] text-[#ccc] w-[80%] mx-auto">By signing up I accept the <span className='text-[#044dd2]'> Terms of Use</span>. I have read and understood the <span className='text-[#044dd2]'>Privacy Policy</span> and <span className='text-[#044dd2]'>Cookies Policy.</span></div>
        </div>
      </div>}
      <div className="pt-[48px]">
        <Routes>
          <Route path="/*">
            <Route path="" element={<Home />} />
            <Route path="category/*" element={<Category />} />
            <Route path="artist/:slug" element={<Artist />} />
            <Route path="music/:slug" element={<Music />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
