import React, { Component,Fragment } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import SimpleReactValidator from 'simple-react-validator';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";

const crop = (url, aspectRatio) => {
    
    // we return a Promise that gets resolved with our canvas element
    return new Promise(resolve => {

        // this image will hold our source image data
        const inputImage = new Image();

        // we want to wait for our image to load
        inputImage.onload = () => {

            // let's store the width and height of our image
            const inputWidth = inputImage.naturalWidth;
            const inputHeight = inputImage.naturalHeight;

            // get the aspect ratio of the input image
            const inputImageAspectRatio = inputWidth / inputHeight;

            // if it's bigger than our target aspect ratio
            let outputWidth = inputWidth;
            let outputHeight = inputHeight;

            if (inputImageAspectRatio > aspectRatio) {
                outputWidth = inputHeight * aspectRatio;
            } else if (inputImageAspectRatio < aspectRatio) {
                outputHeight = inputWidth / aspectRatio;
            }

            // create a canvas that will present the output image
            const outputImage = document.createElement('canvas');

            // set it to the same size as the image


          	const scale = 500/outputHeight;
						//outputWidth = outputWidth*scale;
						//outputHeight = outputHeight*scale;

            // calculate the position to draw the image at
            const outputX = (outputWidth - inputWidth) * .5;
            const outputY = (outputHeight - inputHeight) * .5;

            outputImage.width = outputWidth*scale;
            outputImage.height = outputHeight*scale;

						

            // draw our image at position 0, 0 on the canvas
            const ctx = outputImage.getContext('2d');
						ctx.scale(scale, scale);
						
            ctx.drawImage(inputImage, outputX, outputY);
            resolve(outputImage);
        };

        // start loading our image
        inputImage.src = url;
    }) 
}

export class Form extends Component {
    constructor(props) {
        super(props);
        this.edit = false;
				props.data ? 
					this.state = {
						validator : new SimpleReactValidator(),
							name: props.data.name,
							description: props.data.description,
							ingredients: props.data.ingredients,
							size: props.data.size,
							pictures: props.data.pictures,
					} :
					this.state = {
							validator : new SimpleReactValidator(),
							name: 'Nume produs',
							description: 'Descriere exemplu. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
							ingredients: 'Lorem, ipsum, dolor, sit, amet, consectetur, adipiscing, elit',
							size: 'Mica 5.00 lei | Medie 8.00 lei | Mare 12.00 lei',
							pictures: [
									{ img: '' },
							],
					}
    }

    handleChange = (event) => {
        this.setState({ stock: event.target.value });
    }

    handleEditorChange = (content, editor, name) => {
      this.setState({[name]: content});
     //console.log('Content was updated:', content);
   }
    _handleSubmit(e) {
        e.preventDefault();
    }

    _handleImgChange(e, i) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        const { pictures } = this.state;

        reader.onloadend = async () => {
						const canvas = await crop(reader.result, 4/3);
					  pictures[i].img = canvas.toDataURL();
            //pictures[i].img = reader.result;
            this.setState({
                file: file,
                pictures,
            });
        }
        reader.readAsDataURL(file)
    }

    getContent = (HTML) => {
      var tmp = document.createElement('span');
      tmp.innerHTML = HTML;
      return tmp.textContent;
    }		

    addItem = async (e) => {
      e.preventDefault();
      if(!this.state.validator.allValid()) {
        this.state.validator.showMessages();
        this.forceUpdate();
        return '';
      };
      const data = {
          name: this.state.name,
          description: this.state.description,
          ingredients: this.state.ingredients,
          size: this.state.size,
          price: this.state.price,
          pictures: this.state.pictures,
					category: this.state.category || this.props.categories[0],
					id: this.props.id
      }
			this.setState({
        created: new Date().valueOf(),
        name: 'Nume produs',
        description: 'Descriere exemplu. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ingredients: 'Lorem, ipsum, dolor, sit, amet, consectetur, adipiscing, elit',
        size: 'Mica 5.00 lei | Medie 8.00 lei | Mare 12.00 lei',
        pictures: [
                { img: '' },
          ],
				});
      this.props.addItem(data);
    }

    setStateFromInput = (event) => {
        var obj = {};
        obj[event.target.name] = event.target.value;
        this.setState( { [event.target.name] : event.target.value });      
    }

  
    componentDidMount() {
       /* let search = window.location.search;
        let params = new URLSearchParams(search);
        this.id = params.get('id');
        if(this.id) {
          this.fetchSingleProduct(this.id);
          this.edit = true;
        }*/

    }


	render() {
	  const {show, onCancel, data} = this.props;
		return (
		  <Modal
        backdrop="static"
          className="row d-flex justify-content-center"
          show={show} 
          onHide={onCancel}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Nou</Modal.Title>
          </Modal.Header>
          <ModalBody className="p-3">
				<div className="container-fluid">
						<div className="col-sm-12">
								<div className="row">
									<div className="col-lg-12">
										<ul className="file-upload-product row">
												{
														this.state.pictures.map((res, i) => {
																return (
																		<li key={'p'+i} className="col-lg-3 row">
																				<div className="box-input-file row mx-0 col-lg-12 bg-white">
																						<input className="upload mx-auto" type="file" onChange={(e) => this._handleImgChange(e, i)} />
																						<img src={res.img} style={{ width: 133, height: 100 }} />
																						<a id="result1" onClick={(e) => this._handleSubmit(e.target.id)}></a>
																				</div>
																				{/* <div className="row mx-0 col-lg-12 d-flex justify-content-center">
																					<button onClick={(e)=>this.deleteImg(e,i)}>delete</button>
																				</div>*/}
																		</li>
																)
														})
												}
										</ul>
										{/* <button onClick={(e) => this.addImageSlot(e)}>+ image slot</button>*/}
									</div>
								</div>
								<div className="col-xl-12">
										<form className="needs-validation add-product-form">
												<div className="form form-label-center row">
														<div className="form-group mb-3 col-lg-12">
																<label className="col-xl-3 col-sm-4">Nume</label>
																<div className="description-sm">
																		<Editor name="name"
																			value = {this.state.name}
																			apiKey="1rlgbfk0haw5den30zxey7o3be4lhyfspnp1bge75hi7a6q5"
																			init={{
																				branding: false,
																				elementpath: false,
																				placeholder: 'Denumire',
																				height: 150,
																				menubar: false,
																				plugins: [
																					'advlist charmap print preview visualblocks fullscreen paste'
																				],
																				toolbar:
																					'undo redo | fontsizeselect fontselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | removeformat'
																			}}
																			onEditorChange={(x,y) => this.handleEditorChange(x,y,'name')}
																		/>
																		{this.state.validator.message('name', this.state.name, 'required|string')}                    
																</div>
														</div>
														{/* <div className="form-group mb-3 col-lg-12">
																<label className="col-xl-3 col-sm-4">Nume</label>
																<div className="description-sm">
																		<select name="category" value={this.state.category} onChange={this.setStateFromInput}>
																			<option defaultValue={0}>Alege o optione</option>
																			{ this.props.categories.map((i,j) =>
																					<option key={j} value={i}>{this.getContent(i)}</option>
																				)
																			}
																		</select>
																		{this.state.validator.message('category', this.state.category, 'required')}                    
																</div>
														</div>														 */}
														<div className="form-group mb-3 col-lg-12">
																<label className="col-xl-3 col-sm-4">Ingrediente</label>
																<div className="description-sm">
																		<Editor name="ingredients"
																			value = {this.state.ingredients}
																			init={{
																				placeholder: 'Lista de ingrediente',
																				height: 150,
																				menubar: false,
																				plugins: [
																					'advlist charmap print preview visualblocks fullscreen paste code'
																				],
																				toolbar:
																					'undo redo | fontsizeselect fontselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | removeformat'
																			}}
																			onEditorChange={(x,y) => this.handleEditorChange(x,y,'ingredients')}
																		/>
																		{this.state.validator.message('ingredients', this.state.ingredients, 'required')}                    
																</div>
														</div>                                        
														<div className="form-group mb-3 col-lg-12">
																<label className="col-xl-3 col-sm-4">Descriere</label>
																<div className="description-sm">
																		<Editor
																			value = {this.state.description}
																			init={{
																				placeholder: 'O scurta descriere',
																				height: 200,
																				menubar: false,
																				plugins: [
																					'advlist charmap print preview visualblocks fullscreen paste code wordcount'
																				],
																				toolbar:
																					'undo redo | fontsizeselect fontselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | removeformat'
																			}}
																			onEditorChange={(x,y) => this.handleEditorChange(x,y,'description')}
																		/>
																		{this.state.validator.message('description', this.state.description, 'required|string')}                    
																</div>
														</div>
														<div className="form-group mb-3 col-lg-12">
																<label>Portie</label>
																<div className="description-sm">
																		<Editor
																			value = {this.state.size}
																			init={{
																				//content_css: '../menu/menu.css',
																				height: 150,
																				menubar: false,
																				plugins: [
																					'lists advlist charmap print preview visualblocks fullscreen paste code'
																				],
																				toolbar:
																					'bullist | undo redo | fontsizeselect fontselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | removeformat'
																			}}
																			onEditorChange={(x,y) => this.handleEditorChange(x,y,'size')}
																		/>
																		{this.state.validator.message('size', this.state.size, 'required')}                    
																</div>
														</div>                                                                                                                                                             
												</div>
										</form>
								</div>
						</div>
				</div>
			</ModalBody>
			<Modal.Footer>
			<Button variant="primary" onClick={this.addItem}>
				Salveaza
			</Button>
			<Button variant="primary" onClick={onCancel}>
				Inapoi
			</Button>
		</Modal.Footer>			
			</Modal>
		)
	}
}

export default Form
