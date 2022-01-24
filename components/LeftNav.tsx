import * as React from 'react'
import { useRef, useEffect, useState } from "react"

import Table_of_Contents from "./TOC"

const LeftNav = ({ ids }) => {
  const [isSticky, setIsSticky] = useState(false)
  const ref = useRef()
  
  // mount 
  useEffect(()=>{
    const cachedRef = ref.current,
          observer = new IntersectionObserver(
            ([e]) => setIsSticky(e.intersectionRatio < 1),
            {
              threshold: [1],
              // rootMargin: '-1px 0px 0px 0px',  // alternativly, use this and set `top:0` in the CSS
            }
          )

    observer.observe(cachedRef)
    
    // unmount
    return function(){
      observer.unobserve(cachedRef)
    }
  }, [])

  return (
    <div className={(isSticky ? "leftNav isSticky" : "leftNav")} ref={ref}>
        <Table_of_Contents ids={ids} />
    </div>
  )
}
export default LeftNav;