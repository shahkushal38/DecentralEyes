import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search} from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const { connectWallet, address } = useStateContext();
  const [isConnected, setIsConnected] = useState(false);

  // Update connection status when address changes
  useEffect(() => {
    setIsConnected(!!address);
  }, [address]);

  // Function to format wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnection = async (walletType) => {
    try {
      await connectWallet(walletType);
      setShowWalletDropdown(false);
      setIsConnected(true);
    } catch (error) {
      console.error(`Connection error with ${walletType}:`, error);
      alert(`Failed to connect ${walletType} wallet. Please try again.`);
      setIsConnected(false);
    }
  }

  console.log('address:', address);
  const handleDisconnect = () => {
    try {
      // Generic wallet disconnection method
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
        window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        }).then(() => {
          window.location.reload();
        });
      } else {
        // Fallback for other wallet types
        window.location.reload();
      }
      setIsConnected(false);
    } catch (error) {
      console.error('Disconnect error:', error);
      alert('Failed to disconnect wallet. Please try again.');
    }
  };

  // Connection Status Indicator
  const ConnectionIndicator = () => (
    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
  );

  const WalletDropdown = () => (
    <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-[#1c1c24] ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={() => handleConnection('metamask')}
          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#2c2f32] hover:text-white"
          role="menuitem"
        >
          Connect with MetaMask
        </button>
        <button
          onClick={() => handleConnection('coinbase')}
          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#2c2f32] hover:text-white"
          role="menuitem"
        >
          Connect with Coinbase
        </button>
      </div>
    </div>
  );

  const WalletDetails = () => (
    <div className="flex items-center gap-3">
      <ConnectionIndicator />
      <div className="bg-[#1c1c24] rounded-full py-1 px-3 max-w-[120px]">
        <p className="font-epilogue font-semibold text-white text-xs truncate">
          {formatAddress(address)}
        </p>
      </div>
      <CustomButton 
        btnType="button"
        title="Disconnect"
        styles="bg-[#8c6dfd] text-xs py-1 px-2"
        handleClick={handleDisconnect}
      />
    </div>
  );

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* Search Bar - Responsive Design */}
      <div className="lg:flex-1 flex flex-row max-w-[458px] w-full py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input 
          type="text" 
          placeholder="Search for campaigns" 
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" 
        />
        
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain"/>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden flex-row justify-end gap-4 items-center">
        <div className="relative">
          {address ? (
            <WalletDetails />
          ) : (
            <>
              <CustomButton 
                btnType="button"
                title="Connect Wallet"
                styles="bg-[#8c6dfd]"
                handleClick={() => setShowWalletDropdown(!showWalletDropdown)}
              />
              {showWalletDropdown && <WalletDropdown />}
            </>
          )}
        </div>

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src="" alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex justify-between items-center relative w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>

          <div className="flex-grow"></div>

          <img 
            src={menu}
            alt="menu"
            className="w-[34px] h-[34px] object-contain cursor-pointer"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />
        </div>

        <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-50 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img 
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4 relative">
            {address ? (
              <WalletDetails />
            ) : (
              <>
                <CustomButton 
                  btnType="button"
                  title="Connect Wallet"
                  styles="bg-[#8c6dfd] w-full"
                  handleClick={() => setShowWalletDropdown(!showWalletDropdown)}
                />
                {showWalletDropdown && <WalletDropdown />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar