import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { ForgotPasswordValidation } from "@/lib/validation";
import { useSendRecoveryLink } from "@/lib/react-query/queries";


const ForgotPassword = () => {

    const { toast } = useToast();
    const navigate = useNavigate();

    const { mutateAsync: SendRecoveryLink, isLoading } = useSendRecoveryLink();


    const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
        resolver: zodResolver(ForgotPasswordValidation),
        defaultValues: {
            email: "",
        },
    });

    const handleForgotPassword = async (user: z.infer<typeof ForgotPasswordValidation>) => {

        try {
            const sendLink = await SendRecoveryLink({
                email: user.email,
            });

            if (sendLink) {
                toast({ title: "Reset link sent Successfully, Please check your inbox.", });
            }

        } catch (error: any) {

            if (error.code === 404) {

                toast({ title: "Account Not Found!!, Please try with correct Email !!", });
            } else {
                toast({ title: "Something went wrong, Please try again", });
            }

            navigate("/forgot-password");

            return;
        }

        // console.log(sendLink)
    };

    return (
        <Form {...form}>
            <div className="ulxs:w-260 vxs:w-320 xs:w-420 sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Forgot your Password?
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    Please enter email for verification.
                </p>
                <form
                    onSubmit={form.handleSubmit(handleForgotPassword)}
                    className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Email</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <Button type="submit" className="shad-button_primary">

                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            "Send Reset Password Link"
                        )}
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Don&apos;t have an account?
                        <Link
                            to="/sign-up"
                            className="text-primary-500 text-small-semibold ml-1">
                            Sign up
                        </Link>
                    </p>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link
                            to="/sign-in"
                            className="text-primary-500 text-small-semibold ml-1">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </Form>

    );

}

export default ForgotPassword