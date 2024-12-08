import React, { useState } from 'react';
import { addTool } from '../abi';
import { useNavigate } from 'react-router-dom';

const AddTool = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [docsLink, setDocsLink] = useState('');
  const [socials, setSocials] = useState([{ socialType: '', url: '' }]);
  const navigate = useNavigate();

  const handleAddTool = async (e) => {
    e.preventDefault();
    console.log(name, description, image, repoLink, docsLink, socials);
    await addTool(name, description, image, repoLink, docsLink, socials);
    navigate('/')
  };

  const handleSocialChange = (index, field, value) => {
    const newSocials = [...socials];
    newSocials[index][field] = value;
    setSocials(newSocials);
  };

  const handleAddSocial = () => {
    setSocials([...socials, { socialType: '', url: '' }]);
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.header}>Add a New Tool</h2>
      <form onSubmit={handleAddTool} style={styles.form}>
        <label style={styles.label}>Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>Image URL:
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>Repo Link:
          <input
            type="text"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>Docs Link:
          <input
            type="text"
            value={docsLink}
            onChange={(e) => setDocsLink(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <div style={styles.socials}>
          <h3 style={styles.header}>Social Links</h3>
          {socials.map((social, index) => (
            <div key={index} style={styles.socialInput}>
              <label style={styles.label}>Social Type:
                <input
                  type="text"
                  value={social.socialType}
                  onChange={(e) => handleSocialChange(index, 'socialType', e.target.value)}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>URL:
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                  required
                  style={styles.input}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSocial}
            style={styles.addSocialBtn}
          >
            Add Social
          </button>
        </div>

        <button type="submit" style={styles.submitBtn}>Submit Tool</button>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    width: '50%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
  },
  header: {
    color: '#ffffff',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  socials: {
    marginTop: '20px',
  },
  socialInput: {
    marginBottom: '15px',
  },
  addSocialBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#8c6dfd',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '20px',
    borderRadius: '5px',
  },
};

export default AddTool;
