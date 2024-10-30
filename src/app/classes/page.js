"use client";

import React, { useEffect } from "react";
import { useToken } from "@/context/TokenContext";

const Classes = () => {
  const accessToken = useToken();
  const [classes, setClasses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (accessToken) {
        await getClasses();
      }
    };
  
    fetchClasses();
  }, [accessToken]);

  async function getClasses() {
    const url = 'http://localhost:5000/api/classes';
    let mounted = true;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        if (mounted) setError(`Error: ${response.status}`);
        return;
      }
  
      const data = await response.json();

      
      if (data && data.classes) {
        const classesWithImg = await Promise.all(data.classes.map(async (classItem) => {
          const imgSrc = await getClassImg(classItem.id);
          const classInfo = await getClassInfo(classItem.id);
          return {
            id: classItem.id,
            name: classItem.name.pt_BR,
            imgSrc,
            classInfo,
          }
        }))

        if (mounted) setClasses(classesWithImg);

      } else {
        console.error('Data does not have classes:', data);
        if (mounted) setError('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      if (mounted) setError('Failed to fetch classes');
    } finally {
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }

  async function getClassImg(id) {
    const url = `http://localhost:5000/api/class/img/${id}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        setError(`Error: ${response.status}`);
        return;
      }
  
      const data = await response.json();

      if (data) {
        return data; 
      } else {
        console.error('Data does not have classes:', data);
        setError('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError('Failed to fetch classes');
      return null;
    }
  }

  async function getClassInfo(id) {
    const url = `http://localhost:5000/api/class/${id}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        setError(`Error: ${response.status}`);
        return;
      }
  
      const data = await response.json();
      console.log(data);
      if (data) {
        return data; 
      } else {
        console.error('Data does not have classes:', data);
        setError('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError('Failed to fetch classes');
      return null;
    }
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Classes</h1>
      {error && <p>{error}</p>}
      
      
      {classes.length > 0 ? (
        <ul>
          {classes.map(cls => (
            <li key={`li-${cls.id}`}>
              <h2 key={cls.id}>{cls.classInfo.gender_name.male.pt_BR} / {cls.classInfo.gender_name.female.pt_BR}</h2>
              <img key={`img-${cls.id}`} src={cls.imgSrc} alt={cls.name} />
              <h4>Specializations</h4>
              <ul>
                {cls.classInfo.specializations.map(spec => (
                  <li key={spec.id}>{spec.name.pt_BR}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma classe encontrada.</p>
      )}
    </div>
  );
};

export default Classes;
