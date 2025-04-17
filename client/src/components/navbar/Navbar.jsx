
import Button from '../buttons/Button'
import './Navbar.css'
function Navbar() {
  return (

    <nav className='navbar'>
        <div className='nav-links flex-row'>
        <img alt="Actuary List Logo"  src="https://www.actuarylist.com/img/Actuary-List-Logo.svg" width="210" height="40" decoding="async" data-nimg="1" class="mr-2" loading="lazy" style={{
            color:'transparent'
        }}/>
        <div className='flex-row navigators'>
        <div className='flex-row navigators'>
           <span>About</span>
           <span>Blogs</span>
           <span>Post A Job</span>
        
        </div>
        <Button icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="block h-6 w-6 mr-2"><rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M1 8H3C4.10457 8 4.96446 8.97681 5.60107 9.87947C6.0272 10.4837 6.75545 11 8 11C9.24455 11 9.9728 10.4837 10.3989 9.87947C11.0355 8.97681 11.8954 8 13 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        }
        label={"Get Free Job Alerts"}/>       
</div>

        </div>
    </nav>
  )
}

export default Navbar
