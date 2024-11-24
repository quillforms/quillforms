import { SortableTree } from './Tree/SortableTree';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div
        style={{
            maxWidth: 600,
            padding: 10,
            margin: '0 auto',
            marginTop: '10%',
        }}
    >
        {children}
    </div>
);
const AllFeatures = () => (
    <Wrapper>
        <SortableTree collapsible indicator removable />
    </Wrapper>
);

export default AllFeatures;