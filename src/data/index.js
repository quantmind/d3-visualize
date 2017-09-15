import dataSources from './sources/config';
import array from './sources/config';
import remote from './sources/remote';


dataSources.add('array', array);
dataSources.add('remote', remote);

export default dataSources;
