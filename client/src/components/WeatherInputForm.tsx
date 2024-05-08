import { useForm } from 'react-hook-form';
import styles from './WeatherInputForm.module.css';


type FormValues = {
    searchParam: string;
    units: 'imperial' | 'metric' | 'standard';
};

type WeatherInputFormProps = {
    cb: (searchParam: string, units: 'imperial' | 'metric' | 'standard') => void;
};


const WeatherInputForm = ({ cb }: WeatherInputFormProps) => {
    const { register, handleSubmit } = useForm<FormValues>();

    const onSearch = handleSubmit(formData => {
        const { searchParam, units } = formData;

        if (cb)
            cb(searchParam, units);
    });

    return (
        <div className={styles.card}>
            <div className={styles.title}>
                Get Weather Conditions
            </div>
            <div className={styles.instructions}>
                Input a city name, ZIP code, or GPS coordinates (latitude,longitude)
            </div>
            <form className={styles.weatherForm} onSubmit={onSearch}>
                <div className={styles.inputGroup}>
                    <input className={styles.inputField} {...register('searchParam')} placeholder="City name, zip code, or GPS coordinates (longitude, latitude)" />
                    <select className={styles.selectField} {...register('units', { required: true })}>
                        <option value="imperial">Fahrenheit</option>
                        <option value="metric">Celsius</option>
                        <option value="standard">Kelvin</option>
                    </select>
                </div>
                <input className={styles.submitBtn} type='submit' value="Get Weather Conditions" />
            </form>
        </ div>
    );
}

export default WeatherInputForm;