import Button from "../../../shared/ui/Button";

const CallToAction = () => {
  return (
    <section className="mt-24 px-10">
      <div className="rounded-2xl bg-gradient-to-r from-blue-900/40 to-purple-900/30 border border-blue-500/20 p-12 text-center">
        <h3 className="text-2xl font-bold">
          Ready to Transform Your Community?
        </h3>
        <p className="mt-3 text-sm text-gray-300 max-w-lg mx-auto">
          Join NexaTalk today and start building the future of real-time creator
          interaction.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Button>Start Building</Button>
          <Button variant="secondary">Explore Features</Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
