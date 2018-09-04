import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputField = ({ type, name, value, placeholder, icon, error, onChange, onKeyDown, onBlur }) => {
  return (
    <div className="input-group form-group">
      {icon ? (
        <div className="input-group-prepend">
          <span className="input-group-text" id={name}>
            <i className={icon} />
          </span>
        </div>
      ) : (
        ''
      )}

      <input
        type={type}
        className={classnames('form-control', {
          'is-invalid': error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func
};

InputField.defaultProps = {
  type: 'text'
};

export default InputField;
