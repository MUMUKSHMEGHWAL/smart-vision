import './App.css';
import React from 'react'
import homeImg from './home.png'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Oval } from  'react-loader-spinner'


import { productList } from './product'

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = { 
        searchedImage: "",
        inputValue:"",
        productList,
        foundProducts: [],
        showLoader: false
    };
  }

  getProductFromImage = () => {
    this.setState({
      showLoader: true
    })
    const imgUrl = this.state.inputValue;
    var myHeaders = new Headers();
      myHeaders.append("accept", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", "Basic cm1CcVpzT19scC1jZFdERVVPak5FTlZTODlpOHJaS0g6");
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("urls", imgUrl);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch("https://app.nanonets.com/api/v2/ObjectDetection/Model/4e8d57da-9f06-48fd-bd0a-3d798ab87ccc/LabelUrls/", requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.result && result.result[0] && result.result[0].prediction) {
            const products = Array.from(new Set(result.result[0].prediction.map(product => product.label && product.label.toLocaleLowerCase())))
            this.setState({
              foundProducts: products,
              searchedImage: imgUrl,
              showLoader: false
            })

          }
        })
        .catch(error => {
          console.log('error', error)
          this.setState({
            showLoader: false
          })
        });
  }

  onSearchInputChange = (event) => {
    if(event && event.target && event.target.value) {
      this.setState({
        inputValue: event.target.value
      })
    }
  }
 
  render () {
    const {foundProducts, productList, searchedImage, showLoader}  = this.state
    return (
      <div className="App">
        <header className="headerContainer">
          {/* <img 
            src="https://d3gq2merok8n5r.cloudfront.net/bumblebee/dummy_images/aaaa-1639389567-EcYX9/screenshot-2022-01-27-at-50833-pm-1643283597-HH6cs.png" 
            width="100%"/> */}
            <img src="https://d3gq2merok8n5r.cloudfront.net/bumblebee/dummy_images/aaaa-1639389567-EcYX9/screenshot-2022-01-27-at-115119-pm-1643307809-DW60e.png"
              width="16%"
              className
            />
            <div className="searchBarInputContainer">
              <input className="searchBarInput"
                onInput={this.onSearchInputChange}
                placeholder="Search Products by Image, paste image url..."
              />
              <button  className="searchBtn" 
                onClick={this.getProductFromImage}> Search</button>
            </div>
            <img src="https://d3gq2merok8n5r.cloudfront.net/bumblebee/dummy_images/aaaa-1639389567-EcYX9/screenshot-2022-01-27-at-115106-pm-1643307807-zdMs3.png"
              width="36%"
            />
        </header>
        {searchedImage && searchedImage.length && <div className="HeaderBottom"></div>}
        {searchedImage && searchedImage.length ? <div>
            <h3>Results based on the image</h3> 
            <p className="productDetectedList">Detected Products: &nbsp; {foundProducts.map(productTyep => <p className="tag">{productTyep}</p>)}</p>
            <div className="cotainer">
              <div className="imageContainer">
                <img 
                  src={searchedImage} 
                  alt="product Image" 
                  width="100%"
                />
              </div>
              <div className="resultContainer">
                {foundProducts.map(productType => {
                  const products = productList[productType];
                  return products && products.length ? productList[productType].map((product, i) => {     
                    return (
                    <a className="productContainer" href={product.productURL} key={i} target="_blank">
                    <div className="result">
                      <div className="resultImageContainer">
                        <img 
                          src={product.imageLink}
                          alt="product Image" 
                          width="100%"
                        />
                      </div>
                      <div className="productDescription">
                        <p className="productPrice">${product.price}</p>
                        <p className="productName">{product.productName}</p>
                        <p className="productType">{productType}</p>
                      </div>
                      <div className="heartIcon" >

                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" className="svg-inline--fa fa-heart fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"/></svg>
                      </div>
                    </div></a>) 
                  })
                  : null
                })}
              </div>
            </div>
        </div>: 
        <div>
          <img src={homeImg} width="100%"></img>
        </div>}
        {showLoader  && <div className="loaderContainer"><Oval
          heigth="100"
          width="100"
          color='#eb595f'
          ariaLabel='loading'
        /></div>}
      </div>
    );
}
}

export default App;
