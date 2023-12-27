import aboutMainPage from '../assets/Images/aboutMainImage.png'
import apj from '../assets/Images/apj.png'
import billGates from '../assets/Images/billGates.png'
import einstein from '../assets/Images/einstein.png'
import nelsonMandela from '../assets/Images/nelsonMandela.png'
import steveJobs from '../assets/Images/steveJobs.png'
import HomeLayout from "../layout/HomeLayout";

function Aboutus(){
    return(
        <HomeLayout>
            <div className="flex flex-col text-white pl-20 pt-20 ">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl text-yellow-500 font-semibold">
                            Affordable and quality education
                        </h1>
                        <p className="text-gray-200 text-xl">
                            Our goal is to provide the affordable and quality education to the world.
                            We are providing the platform for the aspiring teachers and students to 
                            share their skills, creativity and knowledge to each other to empower 
                            and contribute in the growth and wellness of mankind.
                        </p>
                    </section>
                    <div className="w-1/2">
                        <img src={aboutMainPage} 
                            className="drop-shadow-2xl" 
                            alt="about main page" 
                        />
                    </div>
                </div>

                <div className="carousel w-1/2 my-10 mx-auto">
                    <div id="slide1" className="carousel-item relative w-full">
                        <div className='flex flex-col items-center justify-center gap-4 px-[15%]'>
                            <img src={steveJobs} className="w-40 rounded-full border-2 border-gray-400 " />
                            <p className='text-xl text-center'>"Don't let the noise of other's opinions drown out your own inner voice."</p>
                            <h3 className='text-2xl'>Steve Jobs</h3>
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                <a href="#slide4" className="btn btn-circle">❮</a> 
                                <a href="#slide2" className="btn btn-circle">❯</a>
                            </div>
                        </div>     
                    </div> 
                    
                    <div id="slide2" className="carousel-item relative w-full">
                        <div className='flex flex-col items-center justify-center gap-4 px-[15%]'>
                            <img src={billGates} className="w-40 rounded-full border-2 border-gray-400 " />
                            <p className='text-xl text-center'>"Success is a lousy teacher. It seduces smart people into thinking they can't lose."</p>
                            <h3 className='text-2xl'>Bill Gates</h3>
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                <a href="#slide1" className="btn btn-circle">❮</a> 
                                <a href="#slide3" className="btn btn-circle">❯</a>
                            </div>
                        </div>
                    </div> 

                    <div id="slide3" className="carousel-item relative w-full">
                        <div className='flex flex-col items-center justify-center gap-4 px-[15%]'>
                            <img src={nelsonMandela} className="w-40 rounded-full border-2 border-gray-400 " />
                            <p className='text-xl text-center'>"A winner is a dreamer who never gives up."</p>
                            <h3 className='text-2xl'>Nelson Mandela</h3>
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                <a href="#slide2" className="btn btn-circle">❮</a> 
                                <a href="#slide4" className="btn btn-circle">❯</a>
                            </div>
                        </div>
                    </div> 

                    <div id="slide4" className="carousel-item relative w-full">
                        <div className='flex flex-col items-center justify-center gap-4 px-[15%]'>
                            <img src={einstein} className="w-40 rounded-full border-2 border-gray-400 " />
                            <p className='text-xl text-center'>"In the middle of difficulty lies opportunity."</p>
                            <h3 className='text-2xl'>Albert Einstein</h3>
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                <a href="#slide3" className="btn btn-circle">❮</a> 
                                <a href="#slide5" className="btn btn-circle">❯</a>
                            </div>
                        </div>  
                    </div>

                <div id="slide5" className="carousel-item relative w-full">
                    <div className='flex flex-col items-center justify-center gap-4 px-[15%]'>
                        <img src={apj} className="w-40 rounded-full border-2 border-gray-400 " />
                        <p className='text-xl text-center'>"If you want to shine like a sun, first burn like a sun."</p>
                        <h3 className='text-2xl'>Dr. A P J Abdul Kalam</h3>
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide4" className="btn btn-circle">❮</a> 
                            <a href="#slide1" className="btn btn-circle">❯</a>
                        </div>
                    </div>         
                </div>
              </div>
            </div>
        </HomeLayout>
    )
}
export default Aboutus;