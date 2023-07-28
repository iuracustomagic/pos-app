/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModal, resetDialog } from 'redux/slices/modalSlice';
import { customers } from 'controllers/index';

function NewCostumer() {
  const [customer, setCustomer] = useState({});
  const dispatch = useDispatch();

  const send = async () => {
    try {
      const result = await customers.addCostumer(customer);
      if (result.status !== 200) throw new Error(result.data);
      dispatch(setModal({ text: 'Customer added successfully!', status: true }));
      dispatch(resetDialog());
    } catch (error) {
      dispatch(setModal({ text: error.response.data || error.message }));
    }
  };

  return (
    <div className="new-costumer">
      <div className="modal-header">
        <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
        <h4 className="modal-title" id="mySmallModalLabel">
          New Customer
        </h4>
      </div>
      <div className="modal-body">
        <form id="saveCustomer" data-parsley-validate>
          <div className="form-group">
            <label htmlFor="userName">Customer Name*</label>
            <input onChange={(e) => setCustomer({ ...customer, name: e.target.value })} type="text" placeholder="Enter name" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="userName">Customer Phone</label>
            <input onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} type="text" name="phone" parsley-trigger="change" placeholder="Enter Phone number" className="form-control" id="phoneNumber" />
          </div>
          <div className="form-group">
            <label htmlFor="userName">Customer Email</label>
            <input onChange={(e) => setCustomer({ ...customer, email: e.target.value })} type="email" placeholder="Enter email address" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="userName">Customer Address</label>
            <input onChange={(e) => setCustomer({ ...customer, address: e.target.value })} type="text" placeholder="Enter address" className="form-control" />
          </div>
          <button onClick={send} type="button" className="btn btn-primary btn-block waves-effect waves-light mt-3 w-100">Send</button>
        </form>
      </div>
    </div>
  );
}

export default NewCostumer;
