import React from 'react'
import Navbar from '../components/Navbar'

const LoanForm = () => {
    return (
        <>
            <Navbar title={'Nueva publicación'} />
            <div className='d-flex flex-column align-items-center'>
                <form className='p-3 rounded col-10 mt-3'>
                    <div className="mb-3">
                        <label htmlFor="loanAmount" className="form-label text-white">Monto del crédito<span className='text-danger'>*</span></label>
                        <input type="email" className="form-control" id="loanAmount" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="interest" className="form-label text-white">Taza de interés<span className='text-danger'>*</span></label>
                        <input type="password" className="form-control" id="interest" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="payments" className="form-label text-white">Cantidad de cuotas<span className='text-danger'>*</span></label>
                        <input type="password" className="form-control" id="payments" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="payment_periods" className="form-label text-white">Tipo de pago<span className='text-danger'>*</span></label>
                        <select class="form-select" id='payment_periods'>
                            <option selected>Seleccione</option>
                            <option value="1">Semanal</option>
                            <option value="2">Mensual</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="comments" class="form-label text-white">Comentarios<span className='text-danger'>*</span></label>
                        <textarea class="form-control" id="comments" rows="3"></textarea>
                    </div>

                    <div className='d-flex justify-content-around'>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="negotiable" />
                            <label class="form-check-label  text-white" for="negotiable">Negociable</label>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="notNegotiable" />
                            <label class="form-check-label  text-white" for="notNegotiable">No negociable</label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 mt-2">Publicar</button>
                </form>
            </div>

        </>
    )
}

export default LoanForm