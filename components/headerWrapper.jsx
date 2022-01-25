export default function Sticky({
    position,
    stuckClasses = "",
    unstuckClasses = "",
    stuckStyles = {},
    unstuckStyles = {},
    children
  }) {
    const [stuck, setStuck] = useState(false)
    const ref = React.createRef()
  
    const classes = stuck ? stuckClasses : unstuckClasses
    const styles = stuck ? stuckStyles : unstuckStyles
  
    const inlineStyles = {
      position: "sticky",
      [position]: -1,
      ...styles
    }
  
    useEffect(() => {
      const cachedRef = ref.current
      const observer = new IntersectionObserver(
        ([e]) => setStuck(e.intersectionRatio < 1),
        { threshold: [1] }
      )
      observer.observe(cachedRef)
      return () => observer.unobserve(cachedRef)
    }, [ref])
  
    return (
      <div style={inlineStyles} className={classes} ref={ref}>
        {children}
      </div>
    )
  }