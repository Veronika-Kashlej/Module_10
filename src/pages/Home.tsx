import { CommunitiesSection } from "../components/CommunitiesSection/CommunitiesSection";
import { CreatePostSection } from "../components/CreatePostSection/CreatePostSection";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { PostCard } from "../components/PostCard/PostCard";
import { SuggestedPeopleSection } from "../components/SuggestedPeopleSection/SuggestedPeopleSection";

const posts = ["1", "2", "3"];

export function Home() {
  return (
    <>
      <Header></Header>
      <main>
        <div className="main-content">
          <CreatePostSection></CreatePostSection>
          <div className="posts-list">
            {posts.map((_, index) => (
              <PostCard key={index}></PostCard>
            ))}
          </div>
        </div>
        <div className="sections">
          <SuggestedPeopleSection></SuggestedPeopleSection>
          <CommunitiesSection></CommunitiesSection>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
