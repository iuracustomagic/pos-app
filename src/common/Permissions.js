/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { parseJwt } from 'helpers';
import translate from 'assets/translation';
import PropTypes from 'prop-types';

function Permissions({ getRights, rights }) {
  const { superadmin } = useMemo(() => parseJwt(localStorage.getItem('jwt')).data, []);
  const [state, setState] = useState(rights || {});
  const lang = useSelector((store) => store.application.lang);

  useEffect(() => {
    getRights(state);
  }, [state]);

  useEffect(() => {
    getRights(state);
  }, []);

  return (
    <div className="permission mt-3">
      <h4>{ translate[lang].Permissions }</h4>
      <hr />
      {
        superadmin ? (
          <div className="form-group">
            <label htmlFor="superadmin_rights">
              { `SuperAdmin ${translate[lang].rights}` }
            </label>
            <input onChange={(e) => setState((prev) => ({ ...prev, superadmin: e.target.checked }))} checked={state.superadmin} type="checkbox" className="form-check-input" id="superadmin_rights" />
          </div>
        ) : null
      }
      <div className="form-group">
        <label htmlFor="admin_rights">
          { translate[lang]['Admin rights'] }
        </label>
        <input onChange={(e) => setState((prev) => ({ ...prev, admin: e.target.checked }))} checked={state.admin} type="checkbox" className="form-check-input" id="admin_rights" />
      </div>
      <div className="form-group">
        <label htmlFor="manager_rights">
          { translate[lang]['Manager rights'] }
        </label>
        <input onChange={(e) => setState((prev) => ({ ...prev, manager: e.target.checked }))} checked={state.manager} type="checkbox" className="form-check-input" id="manager_rights" />
      </div>
    </div>
  );
}

Permissions.propTypes = {
  getRights: PropTypes.func.isRequired,
  rights: PropTypes.object,
};

Permissions.defaultProps = {
  rights: undefined,
};

export default Permissions;
