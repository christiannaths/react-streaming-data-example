import styled from 'styled-components';
import useQuerySubscription from 'hooks/useQuerySubscription';
import useExtents from 'hooks/useExtents';
import StreamingLineChart from 'components/StreamingLineChart';

const Layout = styled.div`
  padding: 1.5rem 2rem;
`;

const Chart = styled(StreamingLineChart)`
  min-height: 300px;
`;

function HomePage() {
  const humidityData = useQuerySubscription('humidity');
  const temperatureData = useQuerySubscription('temperature');

  const [minHum, maxHum] = useExtents(humidityData.map((d) => d.v));
  const [minTemp, maxTemp] = useExtents(temperatureData.map((d) => d.v));

  return (
    <Layout>
      <div>
        <section>
          <h3>
            Relative Humidity %(⤒{maxHum} / ⤓{minHum})
          </h3>
          <Chart
            id="humidity-chart"
            data={humidityData}
            stroke="#00b3df"
            color="gray"
            background="#001532"
          />
        </section>

        <section>
          <h3>
            Temperature ºC (⤒{maxTemp} / ⤓{minTemp})
          </h3>
          <Chart
            id="temp-chart"
            data={temperatureData}
            stroke="#ff4154"
            color="gray"
            background="#001532"
          />
        </section>
      </div>
    </Layout>
  );
}

async function getStaticProps() {
  return {
    props: {},
  };
}

HomePage.defaultProps = {};
HomePage.propTypes = {};

export { getStaticProps };
export default HomePage;
